from pathlib import Path

from bridge.api import create_app
from bridge.storage import InMemoryTaskStore, SqliteTaskStore


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

    status_response = client.get(f'/status/{task_id}')
    assert status_response.status_code == 200
    assert status_response.get_json()['status'] == 'completed'

    result_response = client.get(f'/result/{task_id}')
    assert result_response.status_code == 200
    assert 'Phase 1 scaffold' in result_response.get_json()['result']['message']


def test_task_lifecycle_persists_in_sqlite(tmp_path: Path):
    db_path = tmp_path / 'bridge.db'

    app = create_app(store=SqliteTaskStore(db_path))
    client = app.test_client()

    create_response = client.post('/task', json={'description': 'Open calculator', 'metadata': {'source': 'pytest'}})
    assert create_response.status_code == 202
    task_id = create_response.get_json()['task_id']

    reopened_store = SqliteTaskStore(db_path)
    persisted_task = reopened_store.get_task(task_id)

    assert persisted_task is not None
    assert persisted_task.description == 'Open calculator'
    assert persisted_task.metadata == {'source': 'pytest'}
    assert persisted_task.status.value == 'completed'
    assert persisted_task.completed_at is not None
    assert persisted_task.result is not None
    assert 'Phase 1 scaffold' in persisted_task.result['message']
