"""
Quick test script to verify WiFi scanning works
"""
import requests
import json

# API Configuration
BASE_URL = "http://127.0.0.1:5000"
TOKEN = "mysecrettoken"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_scan():
    """Test the scan endpoint"""
    print("Testing WiFi scan...")
    try:
        response = requests.post(f"{BASE_URL}/api/networks/scan", headers=HEADERS)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_list():
    """Test listing networks"""
    print("\nListing networks...")
    try:
        response = requests.get(f"{BASE_URL}/api/networks", headers=HEADERS)
        print(f"Status: {response.status_code}")
        networks = response.json()
        print(f"Found {len(networks)} networks")
        for net in networks:
            print(f"  - {net['ssid']} ({net['bssid']}) - {net['encryption']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_scan()
    test_list()
