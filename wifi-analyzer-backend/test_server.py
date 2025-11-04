import requests
import time

print("Testing Flask server...")

# Test health endpoint
try:
    response = requests.get('http://127.0.0.1:5000/health')
    print(f"✅ Health check: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ Health check failed: {e}")

# Test scan endpoint
try:
    response = requests.post('http://127.0.0.1:5000/networks/scan')
    print(f"\n✅ Network scan: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ Network scan failed: {e}")

# Test list networks
try:
    response = requests.get('http://127.0.0.1:5000/networks')
    print(f"\n✅ List networks: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"❌ List networks failed: {e}")
