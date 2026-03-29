import os
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from bridge.api import create_app
from bridge.models import TaskCreateRequest
from bridge.storage import InMemoryTaskStore, SqliteTaskStore
from bridge.tasks import AnthropicTaskRunner, BackgroundTaskWorker, DemoTaskRunner, build_runner


class FailingRunner:
    def run(self, task):
        raise RuntimeError(f"runner exploded for {task.description}")


class SlowRunner:
    def run(self, task):
        time.sleep(0.2)
        return {"message": "too slow"}


def wait_for_status(client, task_id: str, expected: str, timeout: float = 1.5):
    deadline = time.time() + timeout
    last_payload = None
    while time.time() < deadline:
        response = client.get(f'/status/{task_id}')
        assert response.status_code == 200
        last_payload = response.get_json()
        if last_payload['status'] == expected:
            return last_payload
        time.sleep(0.02)
    raise AssertionError(f"Task {task_id} never reached {expected}; last payload={last_payload}")


def test_health_endpoint():
    app = create_app(store=InMemoryTaskStore(), runner=DemoTaskRunner())
    client = app.test_client()

    response = client.get('/health')

    assert response.status_code == 200
    assert response.get_json()['status'] == 'ok'


def test_task_lifecycle_scaffold_memory_store():
    app = create_app(store=InMemoryTaskStore(), runner=DemoTaskRunner())
    client = app.test_client()

    create_response = client.post('/task', json={'description': 'Take a screenshot'})
    assert create_response.status_code == 202
    task_id = create_response.get_json()['task_id']
    assert create_response.get_json()['status'] == 'pending'

    status_payload = wait_for_status(client, task_id, 'completed')
    assert status_payload['started_at'] is not None
    assert status_payload['completed_at'] is not None

    result_response = client.get(f'/result/{task_id}')
    assert result_response.status_code == 200
    assert 'Phase 2 worker scaffold' in result_response.get_json()['result']['message']


def test_task_failure_surfaces_error_state():
    app = create_app(store=InMemoryTaskStore(), runner=FailingRunner())
    client = app.test_client()

    create_response = client.post('/task', json={'description': 'Explode the runner'})
    assert create_response.status_code == 202
    task_id = create_response.get_json()['task_id']

    status_payload = wait_for_status(client, task_id, 'failed')
    assert status_payload['started_at'] is not None
    assert status_payload['completed_at'] is not None
    assert 'runner exploded' in status_payload['error']

    result_response = client.get(f'/result/{task_id}')
    assert result_response.status_code == 200
    assert result_response.get_json()['status'] == 'failed'
    assert result_response.get_json()['result'] is None
    assert 'runner exploded' in result_response.get_json()['error']



def test_task_timeout_sets_timeout_state():
    store = InMemoryTaskStore()
    task = store.create_task(TaskCreateRequest(description='Wait forever'))
    task.timeout = 0.05
    store.update_task(task)

    worker = BackgroundTaskWorker(store, runner=SlowRunner())
    try:
        worker.enqueue(task.task_id)

        deadline = time.time() + 1.5
        timed_out = None
        while time.time() < deadline:
            timed_out = store.get_task(task.task_id)
            if timed_out and timed_out.status.value == 'timeout':
                break
            time.sleep(0.02)
        else:
            raise AssertionError(f'Task {task.task_id} never timed out; last task={timed_out}')
    finally:
        worker.shutdown()

    assert timed_out is not None
    assert timed_out.started_at is not None
    assert timed_out.completed_at is not None
    assert 'exceeded timeout' in timed_out.error
    assert timed_out.result is None


def test_task_lifecycle_persists_in_sqlite(tmp_path: Path):
    db_path = tmp_path / 'bridge.db'

    app = create_app(store=SqliteTaskStore(db_path), runner=DemoTaskRunner())
    client = app.test_client()

    create_response = client.post('/task', json={'description': 'Open calculator', 'metadata': {'source': 'pytest'}})
    assert create_response.status_code == 202
    task_id = create_response.get_json()['task_id']

    wait_for_status(client, task_id, 'completed')

    reopened_store = SqliteTaskStore(db_path)
    persisted_task = reopened_store.get_task(task_id)

    assert persisted_task is not None
    assert persisted_task.description == 'Open calculator'
    assert persisted_task.metadata == {'source': 'pytest'}
    assert persisted_task.status.value == 'completed'
    assert persisted_task.started_at is not None
    assert persisted_task.completed_at is not None
    assert persisted_task.result is not None
    assert persisted_task.result['echo']['description'] == 'Open calculator'
    assert 'Phase 2 worker scaffold' in persisted_task.result['message']


# ---------------------------------------------------------------------------
# Runner selection tests (no network calls)
# ---------------------------------------------------------------------------

def test_build_runner_returns_demo_without_api_key():
    """build_runner returns DemoTaskRunner when no ANTHROPIC_API_KEY is configured."""
    clean_env = {k: v for k, v in os.environ.items() if k not in ('ANTHROPIC_API_KEY', 'BRIDGE_RUNNER')}
    with patch.dict(os.environ, clean_env, clear=True):
        runner = build_runner()
    assert isinstance(runner, DemoTaskRunner)


def test_build_runner_forced_demo_overrides_key():
    """BRIDGE_RUNNER=demo forces DemoTaskRunner even when ANTHROPIC_API_KEY is set."""
    with patch.dict(os.environ, {'BRIDGE_RUNNER': 'demo', 'ANTHROPIC_API_KEY': 'sk-ant-fake'}):
        runner = build_runner()
    assert isinstance(runner, DemoTaskRunner)


def test_build_runner_returns_anthropic_when_key_set():
    """build_runner returns AnthropicTaskRunner when ANTHROPIC_API_KEY is present (SDK installed)."""
    pytest.importorskip('anthropic', reason='anthropic SDK not installed')
    clean_env = {k: v for k, v in os.environ.items() if k != 'BRIDGE_RUNNER'}
    clean_env['ANTHROPIC_API_KEY'] = 'sk-ant-fake-key-for-runner-selection-test'
    with patch.dict(os.environ, clean_env, clear=True):
        runner = build_runner()
    assert isinstance(runner, AnthropicTaskRunner)


def test_build_runner_falls_back_to_demo_on_import_error():
    """build_runner falls back to DemoTaskRunner when the anthropic SDK is not installed."""
    with patch.dict(os.environ, {'ANTHROPIC_API_KEY': 'sk-ant-fake'}):
        with patch('bridge.tasks.AnthropicTaskRunner', side_effect=ImportError("No module named 'anthropic'")):
            runner = build_runner()
    assert isinstance(runner, DemoTaskRunner)


def test_anthropic_runner_run_calls_sdk_without_network():
    """AnthropicTaskRunner.run calls the SDK client and returns a structured result (mocked)."""
    pytest.importorskip('anthropic', reason='anthropic SDK not installed')

    mock_content = MagicMock()
    mock_content.text = '1. Open Start menu\n2. Type Calculator\n3. Press Enter'
    mock_response = MagicMock()
    mock_response.model = 'claude-opus-4-6'
    mock_response.stop_reason = 'end_turn'
    mock_response.content = [mock_content]
    mock_response.usage.input_tokens = 10
    mock_response.usage.output_tokens = 20

    store = InMemoryTaskStore()
    task = store.create_task(TaskCreateRequest(description='Open Calculator'))

    with patch('anthropic.Anthropic') as mock_cls:
        mock_client = MagicMock()
        mock_cls.return_value = mock_client
        mock_client.messages.create.return_value = mock_response

        runner = AnthropicTaskRunner(api_key='sk-ant-fake')
        result = runner.run(task)

    mock_client.messages.create.assert_called_once()
    call_kwargs = mock_client.messages.create.call_args
    assert call_kwargs.kwargs['model'] == 'claude-opus-4-6'
    assert 'Open Calculator' in call_kwargs.kwargs['messages'][0]['content']

    assert result['message'] == 'Anthropic runner completed task.'
    assert result['model'] == 'claude-opus-4-6'
    assert result['stop_reason'] == 'end_turn'
    assert 'Open Start menu' in result['plan']
    assert result['artifacts'] == []
    assert result['screenshots'] == []
    assert result['usage']['input_tokens'] == 10
    assert result['usage']['output_tokens'] == 20
