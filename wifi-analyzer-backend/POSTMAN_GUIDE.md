# 📮 Postman Collection Guide

Test all API endpoints with one click using Postman!

## 🚀 Quick Start

### 1. Install Postman

Download from: https://www.postman.com/downloads/

### 2. Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **postman_collection.json** from this directory
4. Click **Import**

✅ You now have all endpoints ready to test!

---

## 🔑 Setup Authentication

The collection is pre-configured with Bearer token authentication.

**Default Token:** `mysecrettoken`

### To Change Token:

1. Click on the collection name "WiFi Security Analyzer API"
2. Go to **Authorization** tab
3. Change the Bearer Token value
4. Click **Save**

OR

Edit `.env` file and restart the server:
```env
API_TOKEN=your-new-token-here
```

---

## 📡 Testing Workflow

### Step 1: Start Server

In terminal:
```powershell
cd "d:\WiFi Security Analyzer\wifi-analyzer-backend"
.\venv\Scripts\Activate.ps1
python app_new.py
```

### Step 2: Test Public Endpoints

1. Click **Public Endpoints** folder
2. Click **Health Check**
3. Click **Send**
4. Verify response: `{"status": "ok", ...}`

### Step 3: Scan Networks

1. Click **Network Management** folder
2. Click **Scan Networks**
3. Click **Send**
4. Save a BSSID from response (e.g., `AA:BB:CC:11:22:33`)

### Step 4: List Networks

1. Click **List All Networks**
2. Click **Send**
3. Verify 3 networks returned

### Step 5: Run Audit

1. Click **Security Audits** folder
2. Click **Start Audit**
3. In **Params** tab, replace `:bssid` with actual BSSID from Step 3
4. Click **Send**
5. Verify audit results returned

### Step 6: View Audits

1. Click **List All Audits**
2. Click **Send**
3. See all audit records

### Step 7: Export Data

1. Click **Data Export** folder
2. Click **Export as JSON**
3. Click **Send**
4. Download the response

---

## 📋 Collection Structure

```
WiFi Security Analyzer API/
├── Public Endpoints/
│   ├── Health Check               (GET)
│   └── Root - API Info            (GET)
├── Network Management/
│   ├── Scan Networks              (POST) 🔒
│   ├── List All Networks          (GET)  🔒
│   └── Get Network by ID          (GET)  🔒
├── Security Audits/
│   ├── Start Audit                (POST) 🔒
│   ├── List All Audits            (GET)  🔒
│   └── Get Audit by ID            (GET)  🔒
├── Data Export/
│   ├── Export as JSON             (GET)  🔒
│   └── Export as CSV              (GET)  🔒
└── Authentication Tests/
    ├── Test No Auth (Should Fail) (GET)
    └── Test Invalid Token         (GET)
```

🔒 = Requires Bearer token authentication

---

## 🧪 Test All Endpoints at Once

### Using Collection Runner:

1. Click the collection name
2. Click **Run** button (right side)
3. Select all requests
4. Click **Run WiFi Security Analyzer API**
5. Watch all tests execute automatically

**Expected Result:** All requests should return 200/201 status (except auth tests which should fail with 401/403).

---

## 🔧 Environment Variables

The collection includes variables you can customize:

| Variable | Default Value | Description |
|----------|--------------|-------------|
| `base_url` | `http://127.0.0.1:5000` | API server URL |
| `api_token` | `mysecrettoken` | Bearer token |

### To Edit Variables:

1. Click collection name
2. Go to **Variables** tab
3. Edit **Current Value**
4. Click **Save**

---

## 📸 Expected Responses

### Health Check
```json
{
  "status": "ok",
  "time": "2025-11-04T13:00:00.000000Z",
  "version": "1.0.0"
}
```

### Scan Networks
```json
{
  "found": 3,
  "networks": [
    {
      "id": "uuid",
      "ssid": "HomeNetwork",
      "bssid": "AA:BB:CC:11:22:33",
      "channel": 6,
      "signal": -50,
      "encryption": "WPA2",
      "discovered_at": "2025-11-04T..."
    },
    ...
  ]
}
```

### Start Audit
```json
{
  "audit_id": "uuid",
  "result": {
    "weak_cipher": true,
    "open_network": false,
    "signal_strength": -50,
    "risk_level": "medium",
    "details": ["Network uses weak encryption..."]
  }
}
```

### Export JSON
```json
{
  "export_date": "2025-11-04T...",
  "total_audits": 1,
  "audits": [...]
}
```

---

## 🐛 Troubleshooting

### Connection Refused Error

**Problem:** Could not connect to server

**Solution:**
- Make sure Flask server is running: `python app_new.py`
- Check the correct port (5000)
- Verify URL: `http://127.0.0.1:5000`

### 401 Unauthorized

**Problem:** Missing authorization header

**Solution:**
- Check Bearer token is set in Authorization tab
- Public endpoints (health, root) don't need auth

### 403 Forbidden

**Problem:** Invalid token

**Solution:**
- Check token matches `.env` file
- Default: `mysecrettoken`
- Update in collection Authorization tab

### 404 Not Found

**Problem:** Invalid endpoint URL

**Solution:**
- Check endpoint path is correct
- For dynamic params (`:bssid`, `:network_id`), replace with actual values

---

## 💡 Tips

1. **Save Responses:** Click "Save Response" to keep examples
2. **Use Tests Tab:** Add automated assertions
3. **Chain Requests:** Use scripts to pass data between requests
4. **Save to Cloud:** Sign in to sync across devices
5. **Share Collection:** Export and share with team

---

## 🔄 Auto-Testing Script (Advanced)

Add to **Tests** tab in requests:

```javascript
// Health check test
pm.test("Status is OK", function() {
    pm.response.to.have.status(200);
    var json = pm.response.json();
    pm.expect(json.status).to.eql("ok");
});

// Scan test
pm.test("Networks found", function() {
    pm.response.to.have.status(201);
    var json = pm.response.json();
    pm.expect(json.found).to.be.above(0);
    pm.expect(json.networks).to.be.an("array");
});

// Auth test
pm.test("Auth required", function() {
    pm.response.to.have.status(401);
});
```

---

## 📦 Alternative: Bruno / Insomnia

Don't like Postman? You can also use:

- **Bruno**: https://www.usebruno.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code extension)

---

## ✅ Success Checklist

- [ ] Postman installed
- [ ] Collection imported
- [ ] Server running
- [ ] Health check successful
- [ ] Authentication working
- [ ] Scan creates networks
- [ ] Audits run successfully
- [ ] Export downloads data

---

## 🎯 Next Steps

Once all Postman tests pass:

1. Build a frontend (React/Vue)
2. Add real WiFi scanning
3. Deploy to cloud
4. Add more security features

---

**Happy Testing! 🚀**
