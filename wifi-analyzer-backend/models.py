from flask_sqlalchemy import SQLAlchemy
import datetime
import json

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

class Network(db.Model):
    id = db.Column(db.String, primary_key=True)
    ssid = db.Column(db.String, nullable=True)
    bssid = db.Column(db.String, unique=True, nullable=False)
    channel = db.Column(db.Integer, nullable=True)
    signal = db.Column(db.Integer, nullable=True)  # RSSI
    encryption = db.Column(db.String, nullable=True)
    discovered_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "ssid": self.ssid,
            "bssid": self.bssid,
            "channel": self.channel,
            "signal": self.signal,
            "encryption": self.encryption,
            "discovered_at": self.discovered_at.isoformat() + "Z" if self.discovered_at else None
        }

class Audit(db.Model):
    id = db.Column(db.String, primary_key=True)
    network_bssid = db.Column(db.String, db.ForeignKey('network.bssid'), nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    result_json = db.Column(db.Text, nullable=True)

    @property
    def result(self):
        return json.loads(self.result_json) if self.result_json else None

    @result.setter
    def result(self, value):
        self.result_json = json.dumps(value)

    def to_dict(self):
        return {
            "id": self.id,
            "network_bssid": self.network_bssid,
            "started_at": self.started_at.isoformat() + "Z" if self.started_at else None,
            "result": self.result
        }
