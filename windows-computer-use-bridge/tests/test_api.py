from bridge.api import create_app


def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get('/health')

    assert response.status_code == 200
    assert response.get_json()['status'] == 'ok'


def test_task_lifecycle_scaffold():
    app = create_app()
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
