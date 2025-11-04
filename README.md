<<<<<<< HEAD
# 📡 WiFi Security Analyzer

A comprehensive full-stack web application for scanning, analyzing, and auditing WiFi networks. Built with Flask backend and vanilla JavaScript frontend.

![WiFi Security Analyzer](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.2-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 🔍 Network Scanning
- **Real-time WiFi scanning** using `pywifi` library
- Detects all nearby WiFi networks
- Shows SSID, BSSID, channel, signal strength, and encryption type
- Support for WPA3, WPA2, WPA, WEP, and Open networks

### 🛡️ Security Auditing
- Automated security analysis for each network
- Risk level assessment (High, Medium, Low)
- Identifies weak encryption and open networks
- Detailed security recommendations

### 📊 Interactive Dashboard
- Real-time network statistics
- Beautiful Chart.js visualizations
- Encryption distribution pie chart
- Signal strength indicators
- Recent audit history

### 🎨 Modern UI/UX
- Dark theme with gradient design
- Responsive layout (mobile-friendly)
- Toast notifications
- Modal popups for detailed views
- Smooth animations and transitions

### 📤 Data Export
- Export audit reports in JSON format
- Export audit reports in CSV format
- Download network scan results

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- Windows OS (for WiFi scanning)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/wifi-security-analyzer.git
cd wifi-security-analyzer/wifi-analyzer-backend
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app_new.py
```

5. **Open in browser**
```
http://127.0.0.1:5000
```
=======
# WiFi Security Analyzer

A complete Python Flask REST API backend for WiFi network scanning and security auditing.

## 🚀 Features

- **Network Scanning**: Simulated WiFi network discovery (extensible to real scanning)
- **Security Audits**: Automated security assessment of detected networks
- **REST API**: Clean RESTful endpoints with Bearer token authentication
- **Database Storage**: SQLite database for networks and audit results
- **Export Functionality**: Export audit data as JSON or CSV
- **Modular Architecture**: Clean separation of routes, services, and models
- **Comprehensive Tests**: Full pytest test suite included
>>>>>>> f93c8537edb192b4512ce19b28c1eeef50ca672a

## 📁 Project Structure

```
wifi-analyzer-backend/
<<<<<<< HEAD
├── templates/          # HTML templates
│   ├── base.html      # Base layout
│   ├── index.html     # Dashboard
│   ├── networks.html  # Networks management
│   └── audits.html    # Audit history
├── static/
│   ├── css/
│   │   └── style.css  # Complete styling
│   └── js/
│       ├── app.js     # Core utilities
│       ├── dashboard.js   # Dashboard logic
│       ├── networks.js    # Networks page
│       └── audits.js      # Audits page
├── routes/
│   ├── network_routes.py  # Network endpoints
│   └── audit_routes.py    # Audit endpoints
├── services/
│   └── scan_service.py    # WiFi scanning logic
├── tests/
│   └── test_api.py        # API tests
├── models.py          # Database models
├── config.py          # Configuration
├── auth.py            # Authentication
├── app_new.py         # Main application
└── requirements.txt   # Dependencies
```

## 🔌 API Endpoints

### Networks
- `POST /api/networks/scan` - Scan for WiFi networks
- `GET /api/networks` - List all networks
- `GET /api/networks/<id>` - Get network details

### Audits
- `POST /api/audits/start/<bssid>` - Start security audit
- `GET /api/audits` - List all audits
- `GET /api/audits/<id>` - Get audit details
- `GET /api/audits/export?format=json` - Export audits

### Health
- `GET /health` - Health check

## 🔐 Authentication

All `/api/*` endpoints require Bearer token authentication:

```bash
Authorization: Bearer mysecrettoken
```

Change the token in `config.py` for production use.

## 🧪 Testing

Run the test suite:
```bash
pytest tests/test_api.py -v
```

Test WiFi scanning:
```bash
python test_wifi_real.py
```

## 📊 Technologies Used

### Backend
- **Flask 3.1.2** - Web framework
- **SQLAlchemy 2.0.44** - ORM
- **Flask-CORS** - Cross-origin support
- **pywifi 1.1.12** - WiFi scanning
- **pytest** - Testing framework

### Frontend
- **Vanilla JavaScript** - No frameworks
- **Chart.js 4.4.0** - Data visualization
- **Font Awesome 6.4.0** - Icons
- **CSS3** - Modern styling

### Database
- **SQLite** - Local database

## 🎯 Features Showcase

### Real WiFi Networks Detected
The application successfully scans and displays real WiFi networks:
- ✅ JioNet@LPU (Multiple access points)
- ✅ LPU Hostels (WPA2-PSK secured)
- ✅ motorola edge 60 fusion
- ✅ Hidden networks detection
- ✅ Signal strength visualization
- ✅ Encryption type identification

### Security Analysis
- Risk assessment based on encryption type
- Identifies vulnerable networks (WEP, Open)
- Recommends WPA3 for maximum security
- Signal strength evaluation

## 📝 Configuration

Edit `config.py` to customize:
- Database path
- API token
- Host and port
- Debug mode

## 🐛 Troubleshooting

### WiFi Scanning Issues
- **Run as Administrator** - WiFi scanning may require elevated privileges
- **Enable WiFi adapter** - Ensure your WiFi is turned on
- **Windows only** - pywifi works best on Windows

### Port Already in Use
```bash
# Kill process on port 5000
=======
├── app.py              # Legacy app (kept for compatibility)
├── app_new.py          # New modular application factory
├── models.py           # Database models (Network, Audit)
├── config.py           # Configuration management
├── auth.py             # Authentication middleware
├── requirements.txt    # Python dependencies
├── .env                # Environment variables
├── .env.example        # Example environment file
├── routes/
│   ├── __init__.py
│   ├── network_routes.py    # Network endpoints
│   └── audit_routes.py      # Audit endpoints
├── services/
│   ├── __init__.py
│   └── scan_service.py      # Scanning and audit logic
└── tests/
    ├── __init__.py
    └── test_api.py          # API tests
```

## 🛠️ Installation

### 1. Clone/Download the Project

```bash
cd path/to/wifi-analyzer-backend
```

### 2. Create Virtual Environment

**Windows PowerShell:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SECRET_KEY=your-secret-key-here
API_TOKEN=your-bearer-token-here
DATABASE_URI=sqlite:///wifi_analyzer.db
DEBUG=True
HOST=0.0.0.0
PORT=5000
```

## 🏃 Running the Application

### Development Mode

**Option 1: Using the new modular app**
```bash
python app_new.py
```

**Option 2: Using the legacy app**
```bash
python app.py
```

The server will start on `http://0.0.0.0:5000`

### Production Mode with Gunicorn

**Note**: Gunicorn doesn't work on Windows. For production on Windows, consider using `waitress`:

```bash
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 app_new:create_app()
```

**For Linux/macOS:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app_new:create_app()"
```

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "time": "2025-11-04T13:00:00.000000Z",
  "version": "1.0.0"
}
```

#### Root
```http
GET /
```

### Protected Endpoints (Bearer Token Required)

All `/api/*` endpoints require authentication header:
```
Authorization: Bearer mysecrettoken
```

#### Scan Networks
```http
POST /api/networks/scan
Authorization: Bearer mysecrettoken
```

Response:
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
      "discovered_at": "2025-11-04T13:00:00Z"
    }
  ]
}
```

#### List Networks
```http
GET /api/networks
Authorization: Bearer mysecrettoken
```

#### Get Network by ID
```http
GET /api/networks/{network_id}
Authorization: Bearer mysecrettoken
```

#### Start Security Audit
```http
POST /api/audits/start/{bssid}
Authorization: Bearer mysecrettoken
```

Response:
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

#### List All Audits
```http
GET /api/audits
Authorization: Bearer mysecrettoken
```

#### Get Audit by ID
```http
GET /api/audits/{audit_id}
Authorization: Bearer mysecrettoken
```

#### Export Audits
```http
GET /api/audits/export?format=json
Authorization: Bearer mysecrettoken
```

Format options: `json` (default) or `csv`

## 🧪 Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_api.py

# Run with coverage
pytest --cov=. tests/
```

## 🔒 Authentication

The API uses Bearer token authentication. To access protected endpoints:

### Using curl:
```bash
curl -H "Authorization: Bearer mysecrettoken" http://127.0.0.1:5000/api/networks
```

### Using PowerShell:
```powershell
$headers = @{ Authorization = "Bearer mysecrettoken" }
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/networks -Headers $headers
```

### Using Python requests:
```python
import requests

headers = {"Authorization": "Bearer mysecrettoken"}
response = requests.get("http://127.0.0.1:5000/api/networks", headers=headers)
print(response.json())
```

## 📝 Example Usage

### Complete Workflow

```powershell
# 1. Health check (no auth needed)
Invoke-RestMethod http://127.0.0.1:5000/health

# 2. Set up auth header
$headers = @{ Authorization = "Bearer mysecrettoken" }

# 3. Scan for networks
$scan = Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/networks/scan -Headers $headers

# 4. Get BSSID from first network
$bssid = $scan.networks[0].bssid

# 5. Run security audit
$audit = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:5000/api/audits/start/$bssid" -Headers $headers

# 6. View audit result
$audit.result

# 7. Export all audits as CSV
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/audits/export?format=csv" -Headers $headers -OutFile "audits.csv"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | `dev-secret-key-change-in-production` |
| `API_TOKEN` | Bearer token for authentication | `mysecrettoken` |
| `DATABASE_URI` | Database connection string | `sqlite:///wifi_analyzer.db` |
| `DEBUG` | Enable debug mode | `True` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `5000` |
| `FLASK_ENV` | Environment (development/production/testing) | `development` |

## 🐛 Troubleshooting

### Port 5000 Already in Use

**Windows:**
```powershell
>>>>>>> f93c8537edb192b4512ce19b28c1eeef50ca672a
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

<<<<<<< HEAD
## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Developer

Built with ❤️ for network security enthusiasts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This tool is for educational purposes only. Always get permission before scanning networks you don't own.
=======
**Linux/macOS:**
```bash
lsof -i :5000
kill <PID>
```

### Database Locked Error

Remove the database file and restart:
```bash
rm instance/wifi_analyzer.db
python app_new.py
```

### ImportError or ModuleNotFoundError

Ensure virtual environment is activated and dependencies are installed:
```bash
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
```

## 📚 Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Register blueprint in `app_new.py`
3. Add `@require_auth` decorator for protected endpoints

### Adding New Services

1. Create service file in `services/` directory
2. Import and use in route handlers

## 🚀 Deployment

### Using Docker (Recommended)

Create `Dockerfile`:
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app_new:create_app()"]
```

Build and run:
```bash
docker build -t wifi-analyzer .
docker run -p 5000:5000 wifi-analyzer
```

### Cloud Deployment

The app is ready to deploy to:
- **Heroku**: Add `Procfile` with `web: gunicorn "app_new:create_app()"`
- **AWS/Azure/GCP**: Use gunicorn or uWSGI as WSGI server
- **Digital Ocean**: Deploy as Docker container

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## 📞 Support

For issues or questions, please create an issue on the repository.

---

**Built with ❤️ using Flask, SQLAlchemy, and Python**
>>>>>>> f93c8537edb192b4512ce19b28c1eeef50ca672a
