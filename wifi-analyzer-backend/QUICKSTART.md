# 🚀 Quick Start Guide

## Start the Server

```powershell
cd "d:\WiFi Security Analyzer\wifi-analyzer-backend"
.\venv\Scripts\Activate.ps1
python app_new.py
```

Server runs at: `http://127.0.0.1:5000`

## Test the API

### 1. Health Check (No Auth)
```powershell
Invoke-RestMethod http://127.0.0.1:5000/health
```

### 2. Set Auth Token
```powershell
$headers = @{ Authorization = "Bearer mysecrettoken" }
```

### 3. Scan Networks
```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/networks/scan -Headers $headers
```

### 4. List Networks
```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
```

### 5. Run Security Audit
```powershell
# Get first network BSSID
$networks = Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
$bssid = $networks[0].bssid

# Start audit
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:5000/api/audits/start/$bssid" -Headers $headers
```

### 6. Export Results
```powershell
# JSON format
Invoke-RestMethod "http://127.0.0.1:5000/api/audits/export?format=json" -Headers $headers

# CSV format
Invoke-RestMethod "http://127.0.0.1:5000/api/audits/export?format=csv" -Headers $headers -OutFile "audits.csv"
```

## Run Tests

```powershell
pytest tests/test_api.py -v
```

## Project Files

- **app_new.py** - New modular Flask app (recommended)
- **app.py** - Legacy app (still works)
- **models.py** - Database models
- **config.py** - Configuration management
- **auth.py** - Authentication middleware
- **routes/** - API endpoints
- **services/** - Business logic
- **tests/** - Test suite

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Health check |
| `/` | GET | No | API information |
| `/api/networks/scan` | POST | Yes | Scan networks |
| `/api/networks` | GET | Yes | List networks |
| `/api/networks/<id>` | GET | Yes | Get network |
| `/api/audits/start/<bssid>` | POST | Yes | Start audit |
| `/api/audits` | GET | Yes | List audits |
| `/api/audits/<id>` | GET | Yes | Get audit |
| `/api/audits/export` | GET | Yes | Export audits |

## Default Settings

- **API Token**: `mysecrettoken`
- **Database**: `instance/wifi_analyzer.db`
- **Port**: `5000`
- **Debug**: Enabled

Change these in `.env` file!

## Need Help?

See full documentation in `README.md`
