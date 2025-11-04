"""
WiFi Security Analyzer Backend
Main Flask application entry point
"""
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from models import db
from config import config
from routes.network_routes import network_bp
from routes.audit_routes import audit_bp
from auth import require_auth
import os


def create_app(config_name='default'):
    """
    Application factory pattern
    
    Args:
        config_name: Configuration environment (development/production/testing)
        
    Returns:
        Flask app instance
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(network_bp)
    app.register_blueprint(audit_bp)
    
    # Frontend Routes
    @app.route('/')
    def dashboard():
        """Main dashboard page"""
        return render_template('index.html')
    
    @app.route('/networks')
    def networks_page():
        """Networks management page"""
        return render_template('networks.html')
    
    @app.route('/audits')
    def audits_page():
        """Audits history page"""
        return render_template('audits.html')
    
    # API Routes
    
    # Health check endpoint (no auth required)
    @app.route('/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        import datetime
        return jsonify({
            "status": "ok",
            "time": datetime.datetime.utcnow().isoformat() + "Z",
            "version": "1.0.0"
        })
    
    # API Info endpoint
    @app.route('/api', methods=['GET'])
    def api_info():
        """API information endpoint"""
        return jsonify({
            "message": "WiFi Security Analyzer API",
            "version": "1.0.0",
            "endpoints": {
                "health": "/health",
                "networks": "/api/networks",
                "scan": "/api/networks/scan",
                "audits": "/api/audits",
                "export": "/api/audits/export"
            },
            "auth": "Bearer token required for /api/* endpoints"
        })
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app


if __name__ == "__main__":
    # Get environment
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    # Run the app
    app.run(
        debug=app.config['DEBUG'],
        host=app.config['HOST'],
        port=app.config['PORT']
    )
