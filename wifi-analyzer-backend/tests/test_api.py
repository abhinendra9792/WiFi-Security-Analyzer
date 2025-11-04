"""
API Tests for WiFi Security Analyzer Backend
"""
import pytest
import json
from app_new import create_app
from models import db, Network, Audit


@pytest.fixture
def client():
    """Create test client"""
    app = create_app('testing')
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()


@pytest.fixture
def auth_headers():
    """Return authorization headers"""
    return {'Authorization': 'Bearer mysecrettoken'}


def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'time' in data


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'WiFi Security Analyzer' in data['message']


def test_scan_without_auth(client):
    """Test scan endpoint without authentication"""
    response = client.post('/api/networks/scan')
    assert response.status_code == 401


def test_scan_with_invalid_token(client):
    """Test scan endpoint with invalid token"""
    headers = {'Authorization': 'Bearer wrongtoken'}
    response = client.post('/api/networks/scan', headers=headers)
    assert response.status_code == 403


def test_scan_with_auth(client, auth_headers):
    """Test scan endpoint with valid authentication"""
    response = client.post('/api/networks/scan', headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'found' in data
    assert data['found'] == 3
    assert 'networks' in data
    assert len(data['networks']) == 3


def test_list_networks(client, auth_headers):
    """Test list networks endpoint"""
    # First scan to populate data
    client.post('/api/networks/scan', headers=auth_headers)
    
    # Then list
    response = client.get('/api/networks', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) == 3


def test_start_audit(client, auth_headers):
    """Test starting an audit"""
    # First scan to create a network
    scan_response = client.post('/api/networks/scan', headers=auth_headers)
    scan_data = json.loads(scan_response.data)
    bssid = scan_data['networks'][0]['bssid']
    
    # Start audit
    response = client.post(f'/api/audits/start/{bssid}', headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'audit_id' in data
    assert 'result' in data
    assert 'risk_level' in data['result']


def test_list_audits(client, auth_headers):
    """Test list audits endpoint"""
    # Create a network and audit
    scan_response = client.post('/api/networks/scan', headers=auth_headers)
    scan_data = json.loads(scan_response.data)
    bssid = scan_data['networks'][0]['bssid']
    client.post(f'/api/audits/start/{bssid}', headers=auth_headers)
    
    # List audits
    response = client.get('/api/audits', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) >= 1


def test_export_audits_json(client, auth_headers):
    """Test exporting audits as JSON"""
    # Create audit data
    scan_response = client.post('/api/networks/scan', headers=auth_headers)
    scan_data = json.loads(scan_response.data)
    bssid = scan_data['networks'][0]['bssid']
    client.post(f'/api/audits/start/{bssid}', headers=auth_headers)
    
    # Export as JSON
    response = client.get('/api/audits/export?format=json', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'export_date' in data
    assert 'total_audits' in data
    assert 'audits' in data


def test_export_audits_csv(client, auth_headers):
    """Test exporting audits as CSV"""
    # Create audit data
    scan_response = client.post('/api/networks/scan', headers=auth_headers)
    scan_data = json.loads(scan_response.data)
    bssid = scan_data['networks'][0]['bssid']
    client.post(f'/api/audits/start/{bssid}', headers=auth_headers)
    
    # Export as CSV
    response = client.get('/api/audits/export?format=csv', headers=auth_headers)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'text/csv'
    assert b'Audit ID' in response.data
