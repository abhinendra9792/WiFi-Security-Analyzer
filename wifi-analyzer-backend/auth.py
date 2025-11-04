"""
Authentication Middleware
Provides Bearer token authentication for API endpoints
"""
from functools import wraps
from flask import request, jsonify, current_app


def require_auth(f):
    """
    Decorator to require Bearer token authentication
    
    Usage:
        @app.route('/protected')
        @require_auth
        def protected_route():
            return jsonify({"message": "Success"})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({"error": "Invalid Authorization header format. Use 'Bearer <token>'"}), 401
        
        token = parts[1]
        expected_token = current_app.config.get('API_TOKEN', 'mysecrettoken')
        
        if token != expected_token:
            return jsonify({"error": "Invalid token"}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
