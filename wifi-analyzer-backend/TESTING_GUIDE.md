# 🧪 Testing Guide - WiFi Security Analyzer Backend

Complete step-by-step guide to test your backend is working correctly.

---

## 🧠 1. Activate Virtual Environment

### Windows (PowerShell):
```powershell
cd "d:\WiFi Security Analyzer\wifi-analyzer-backend"
.\venv\Scripts\Activate.ps1
```

### macOS/Linux:
```bash
cd /path/to/wifi-analyzer-backend
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

---

## ⚙️ 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Expected output: All packages installed successfully.

---

## 🚀 3. Run the Flask App

```bash
python app_new.py
```

**Expected output:**
```
 * Serving Flask app 'app_new'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

✅ **Server is running!** Keep this terminal open.

---

## 🌐 4. Test Endpoints

Open a **new terminal** (keep the server running in the first one).

### Method 1: Using PowerShell (Windows)

#### ✅ **(a) Health Check** - No Auth Required

```powershell
Invoke-RestMethod http://127.0.0.1:5000/health
```

**Expected output:**
```json
{
  "status": "ok",
  "time": "2025-11-04T13:00:00.000000Z",
  "version": "1.0.0"
}
```

#### ✅ **(b) Root Endpoint** - No Auth Required

```powershell
Invoke-RestMethod http://127.0.0.1:5000/
```

**Expected output:**
```json
{
  "message": "WiFi Security Analyzer API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

#### 🔑 **Set Authorization Header**

```powershell
$headers = @{ Authorization = "Bearer mysecrettoken" }
```

#### 📡 **(c) Simulate Network Scan** - Auth Required

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/networks/scan -Headers $headers
```

**Expected output:**
```json
{
  "found": 3,
  "networks": [
    {
      "id": "uuid-here",
      "ssid": "HomeNetwork",
      "bssid": "AA:BB:CC:11:22:33",
      "channel": 6,
      "signal": -50,
      "encryption": "WPA2",
      "discovered_at": "2025-11-04T13:00:00Z"
    },
    {
      "ssid": "CoffeeShop",
      "bssid": "12:34:56:AA:BB:CC",
      ...
    },
    {
      "ssid": "OfficeNet",
      "bssid": "DE:AD:BE:EF:00:01",
      ...
    }
  ]
}
```

#### 📋 **(d) View All Networks** - Auth Required

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
```

**Expected output:** Array of all scanned networks (3 networks).

#### 🔍 **(e) Start Security Audit** - Auth Required

First, get a BSSID from scanned networks:

```powershell
$networks = Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
$bssid = $networks[0].bssid
```

Then start the audit:

```powershell
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:5000/api/audits/start/$bssid" -Headers $headers
```

**Expected output:**
```json
{
  "audit_id": "uuid-here",
  "result": {
    "weak_cipher": true,
    "open_network": false,
    "signal_strength": -50,
    "risk_level": "medium",
    "details": ["Network uses weak encryption..."]
  }
}
```

#### 📊 **(f) View All Audits** - Auth Required

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/audits -Headers $headers
```

**Expected output:** Array of all audit results.

#### 💾 **(g) Export as JSON** - Auth Required

```powershell
Invoke-RestMethod "http://127.0.0.1:5000/api/audits/export?format=json" -Headers $headers
```

**Expected output:**
```json
{
  "export_date": "2025-11-04T13:00:00Z",
  "total_audits": 1,
  "audits": [...]
}
```

#### 📄 **(h) Export as CSV** - Auth Required

```powershell
Invoke-RestMethod "http://127.0.0.1:5000/api/audits/export?format=csv" -Headers $headers -OutFile "audits.csv"
```

**Expected:** File `audits.csv` created in current directory.

---

### Method 2: Using curl (Linux/macOS/Git Bash)

#### Health Check
```bash
curl http://127.0.0.1:5000/health
```

#### Scan Networks
```bash
curl -X POST http://127.0.0.1:5000/api/networks/scan \
  -H "Authorization: Bearer mysecrettoken"
```

#### List Networks
```bash
curl http://127.0.0.1:5000/api/networks \
  -H "Authorization: Bearer mysecrettoken"
```

#### Start Audit
```bash
# Replace BSSID with actual value from scan
curl -X POST http://127.0.0.1:5000/api/audits/start/AA:BB:CC:11:22:33 \
  -H "Authorization: Bearer mysecrettoken"
```

#### List Audits
```bash
curl http://127.0.0.1:5000/api/audits \
  -H "Authorization: Bearer mysecrettoken"
```

#### Export
```bash
curl "http://127.0.0.1:5000/api/audits/export?format=json" \
  -H "Authorization: Bearer mysecrettoken"
```

---

### Method 3: Using Browser

Only works for GET endpoints without auth or health check:

1. Open browser
2. Go to: `http://127.0.0.1:5000/health`
3. Go to: `http://127.0.0.1:5000/`

For authenticated endpoints, use **Postman** (see below).

---

## 🧪 5. Run Automated Tests

We have a complete test suite with 10 tests:

```bash
pytest tests/test_api.py -v
```

**Expected output:**
```
tests/test_api.py::test_health_endpoint PASSED          [ 10%]
tests/test_api.py::test_root_endpoint PASSED            [ 20%]
tests/test_api.py::test_scan_without_auth PASSED        [ 30%]
tests/test_api.py::test_scan_with_invalid_token PASSED  [ 40%]
tests/test_api.py::test_scan_with_auth PASSED           [ 50%]
tests/test_api.py::test_list_networks PASSED            [ 60%]
tests/test_api.py::test_start_audit PASSED              [ 70%]
tests/test_api.py::test_list_audits PASSED              [ 80%]
tests/test_api.py::test_export_audits_json PASSED       [ 90%]
tests/test_api.py::test_export_audits_csv PASSED        [100%]

======== 10 passed in 1.17s ========
```

✅ **All tests passed!**

---

## 🧱 6. Database Check

Your data is stored in: `instance/wifi_analyzer.db`

### Option 1: Using Python

```python
import sqlite3

conn = sqlite3.connect('instance/wifi_analyzer.db')
cursor = conn.cursor()

# View all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cursor.fetchall())

# View networks
cursor.execute("SELECT * FROM network")
print(cursor.fetchall())

# View audits
cursor.execute("SELECT * FROM audit")
print(cursor.fetchall())

conn.close()
```

### Option 2: Using sqlite3 command line

```bash
sqlite3 instance/wifi_analyzer.db
```

Then run:
```sql
.tables
SELECT * FROM network;
SELECT * FROM audit;
.exit
```

### Option 3: Using DB Browser for SQLite

1. Download: https://sqlitebrowser.org/
2. Open: `instance/wifi_analyzer.db`
3. Browse Data tab to see tables

---

## 🧪 7. Test Authentication

### Test Without Token (Should Fail)

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/networks
```

**Expected:** Error 401 - Missing Authorization header

### Test With Wrong Token (Should Fail)

```powershell
$badHeaders = @{ Authorization = "Bearer wrongtoken" }
Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $badHeaders
```

**Expected:** Error 403 - Invalid token

### Test With Correct Token (Should Work)

```powershell
$headers = @{ Authorization = "Bearer mysecrettoken" }
Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
```

**Expected:** List of networks

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Health check returns status "ok"
- [ ] Root endpoint returns API information
- [ ] Scan endpoint creates 3 networks
- [ ] List networks returns saved networks
- [ ] Start audit creates audit record
- [ ] List audits returns audit data
- [ ] Export JSON works
- [ ] Export CSV creates file
- [ ] All pytest tests pass (10/10)
- [ ] Database file created with data
- [ ] Authentication rejects invalid tokens

---

## 🐛 Troubleshooting

### Server won't start

**Problem:** Port 5000 already in use

**Solution:**
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill <PID>
```

### Import errors

**Problem:** ModuleNotFoundError

**Solution:**
```bash
# Make sure venv is activated
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/macOS

# Reinstall dependencies
pip install -r requirements.txt
```

### Database errors

**Problem:** Database locked or corrupted

**Solution:**
```bash
# Delete and recreate database
rm instance/wifi_analyzer.db
python app_new.py  # Will recreate on startup
```

### Authentication not working

**Problem:** 401/403 errors

**Solution:**
- Check token in `.env` file matches your request
- Default token: `mysecrettoken`
- Format: `Authorization: Bearer mysecrettoken`

---

## 🎯 Next Steps

If all tests pass, you're ready to:

1. **Connect a frontend** (React, Vue, or HTML/CSS)
2. **Add real WiFi scanning** (using scapy or similar)
3. **Deploy to production** (Heroku, AWS, Docker)
4. **Add more security features** (WPA cracking detection, etc.)

---

## 📦 Postman Collection

Import `postman_collection.json` for one-click testing of all endpoints!

See: [Postman Collection Guide](./POSTMAN_GUIDE.md)
