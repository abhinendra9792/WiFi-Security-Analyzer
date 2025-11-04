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

## 📁 Project Structure

```
wifi-analyzer-backend/
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
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

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
