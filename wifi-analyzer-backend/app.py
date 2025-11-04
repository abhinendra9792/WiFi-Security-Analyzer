from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, init_db, Network, Audit
import datetime
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wifi_analyzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.datetime.utcnow().isoformat() + "Z"})

# Simulated scan: returns a few networks (later we'll replace with real scanning)
@app.route("/networks/scan", methods=["POST"])
def scan_networks():
    # in real version, accept args like duration/interface
    sample = [
        {"ssid": "HomeNetwork", "bssid": "AA:BB:CC:11:22:33", "channel": 6, "signal": -50, "enc": "WPA2"},
        {"ssid": "CoffeeShop", "bssid": "12:34:56:AA:BB:CC", "channel": 11, "signal": -70, "enc": "Open"},
        {"ssid": "OfficeNet", "bssid": "DE:AD:BE:EF:00:01", "channel": 1, "signal": -60, "enc": "WPA3"}
    ]
    # save detected networks to DB
    saved = []
    for n in sample:
        net = Network(id=str(uuid.uuid4()), ssid=n["ssid"], bssid=n["bssid"],
                      channel=n["channel"], signal=n["signal"], encryption=n["enc"])
        db.session.add(net)
        saved.append(net.to_dict())
    db.session.commit()
    return jsonify({"found": len(saved), "networks": saved}), 201

@app.route("/networks", methods=["GET"])
def list_networks():
    nets = Network.query.all()
    return jsonify([n.to_dict() for n in nets])

@app.route("/audit", methods=["POST"])
def start_audit():
    data = request.json or {}
    bssid = data.get("bssid")
    if not bssid:
        return jsonify({"error": "bssid required"}), 400

    net = Network.query.filter_by(bssid=bssid).first()
    if not net:
        return jsonify({"error": "network not found"}), 404

    # simulate audit checks
    result = {
        "weak_cipher": False if net.encryption and "WPA3" in net.encryption else True,
        "open_network": True if net.encryption.lower() == "open" else False,
        "signal_strength": net.signal
    }

    audit = Audit(id=str(uuid.uuid4()), network_bssid=bssid,
                  started_at=datetime.datetime.utcnow(), result=result)
    db.session.add(audit)
    db.session.commit()
    return jsonify({"audit_id": audit.id, "result": result}), 201

@app.route("/audit/<audit_id>", methods=["GET"])
def get_audit(audit_id):
    a = Audit.query.filter_by(id=audit_id).first()
    if not a:
        return jsonify({"error": "not found"}), 404
    return jsonify(a.to_dict())

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5000)
