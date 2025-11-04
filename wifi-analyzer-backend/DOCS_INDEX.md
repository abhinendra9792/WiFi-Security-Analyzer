# 📚 Documentation Index

Complete guide to WiFi Security Analyzer Backend

---

## 🚀 Quick Links

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes | First time setup |
| [README.md](./README.md) | Complete documentation | Full reference |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Test all endpoints | Verify everything works |
| [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) | Postman collection guide | GUI testing |

---

## 📖 Documentation Files

### 1. QUICKSTART.md
**⚡ 5-Minute Setup Guide**

- Start server commands
- Basic API testing
- Quick examples
- Essential endpoints

**Start here if:** This is your first time running the app.

---

### 2. README.md
**📘 Complete Documentation**

- Full installation guide
- All API endpoints
- Configuration options
- Deployment instructions
- Troubleshooting

**Use this for:** In-depth information and deployment.

---

### 3. TESTING_GUIDE.md
**🧪 Comprehensive Testing**

- Step-by-step testing workflow
- PowerShell/curl commands
- Expected outputs
- Database verification
- Automated pytest tests

**Use this for:** Verifying everything works correctly.

---

### 4. POSTMAN_GUIDE.md
**📮 GUI Testing with Postman**

- Import collection instructions
- Authentication setup
- Collection runner
- Visual testing

**Use this for:** Testing without command line.

---

## 🛠️ Useful Scripts

### inspect_db.py
View database contents without SQL

```bash
python inspect_db.py
```

Shows:
- All networks
- All audits
- Statistics
- Encryption distribution
- Risk level summary

---

### test_server.py
Quick API health check

```bash
python test_server.py
```

Tests:
- Health endpoint
- Network scan
- List networks

---

## 🎯 Common Tasks

### Start the Server
```powershell
cd "d:\WiFi Security Analyzer\wifi-analyzer-backend"
.\venv\Scripts\Activate.ps1
python app_new.py
```

### Run All Tests
```bash
pytest tests/test_api.py -v
```

### View Database
```bash
python inspect_db.py
```

### Test One Endpoint
```powershell
$headers = @{ Authorization = "Bearer mysecrettoken" }
Invoke-RestMethod http://127.0.0.1:5000/api/networks -Headers $headers
```

---

## 📊 Project Structure

```
wifi-analyzer-backend/
│
├── 📄 Documentation
│   ├── README.md              # Complete docs
│   ├── QUICKSTART.md          # Quick start
│   ├── TESTING_GUIDE.md       # Testing guide
│   ├── POSTMAN_GUIDE.md       # Postman guide
│   └── DOCS_INDEX.md          # This file
│
├── 🚀 Application Files
│   ├── app_new.py             # Main app (recommended)
│   ├── app.py                 # Legacy app
│   ├── models.py              # Database models
│   ├── config.py              # Configuration
│   └── auth.py                # Authentication
│
├── 📁 Modules
│   ├── routes/                # API endpoints
│   │   ├── network_routes.py
│   │   └── audit_routes.py
│   └── services/              # Business logic
│       └── scan_service.py
│
├── 🧪 Testing
│   ├── tests/                 # Test suite
│   │   └── test_api.py
│   └── postman_collection.json # Postman tests
│
├── 🔧 Utilities
│   ├── inspect_db.py          # Database inspector
│   └── test_server.py         # Quick API test
│
└── ⚙️ Configuration
    ├── .env                   # Environment variables
    ├── .env.example           # Template
    ├── requirements.txt       # Dependencies
    └── .gitignore             # Git ignore rules
```

---

## 🎓 Learning Path

### Beginner
1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Start server
3. Test health endpoint
4. Run `python inspect_db.py`

### Intermediate
1. Read [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Test all endpoints with PowerShell
3. Run pytest tests
4. Import Postman collection

### Advanced
1. Read [README.md](./README.md) deployment section
2. Modify routes or services
3. Add custom endpoints
4. Deploy to cloud

---

## ❓ FAQ

**Q: Which app file should I use?**
A: Use `app_new.py` - it's the modular, production-ready version.

**Q: How do I change the API token?**
A: Edit `.env` file, change `API_TOKEN=your-new-token`

**Q: Where is the database?**
A: `instance/wifi_analyzer.db` (created automatically)

**Q: Can I test without Postman?**
A: Yes! Use PowerShell commands in TESTING_GUIDE.md

**Q: How do I add a new endpoint?**
A: Add route in `routes/`, add service logic in `services/`

**Q: Tests are failing, what to do?**
A: Check server is running, check auth token, see TESTING_GUIDE.md troubleshooting

---

## 🔗 External Resources

- **Flask Docs**: https://flask.palletsprojects.com/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Postman**: https://www.postman.com/
- **pytest**: https://docs.pytest.org/

---

## 📞 Getting Help

1. Check relevant documentation file above
2. Look in TESTING_GUIDE.md troubleshooting section
3. Run `python inspect_db.py` to check database
4. Check server logs in terminal

---

## ✅ Quick Checklist

**Before First Run:**
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file exists (copy from `.env.example`)

**For Testing:**
- [ ] Server is running (`python app_new.py`)
- [ ] Health check works
- [ ] Auth token is correct
- [ ] Postman collection imported (optional)

**For Development:**
- [ ] Read README.md architecture section
- [ ] Understand routes structure
- [ ] Understand services layer
- [ ] Write tests for new features

---

**📚 Start with QUICKSTART.md → Then explore other docs as needed!**
