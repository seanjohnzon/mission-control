import time
from pathlib import Path

from bridge.api import create_app
from bridge.storage import InMemoryTaskStore, SqliteTaskStore


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
    app = create_app(store=InMemoryTaskStore())
    client = app.test_client()

    response = client.get('/health')

    assert response.status_code == 200
    assert response.get_json()['status'] == 'ok'


def test_task_lifecycle_scaffold_memory_store():
    app = create_app(store=InMemoryTaskStore())
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


def test_task_lifecycle_persists_in_sqlite(tmp_path: Path):
    db_path = tmp_path / 'bridge.db'

    app = create_app(store=SqliteTaskStore(db_path))
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
