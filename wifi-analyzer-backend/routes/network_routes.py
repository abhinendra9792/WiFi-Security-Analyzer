"""
Network Routes
Handles all WiFi network scanning and listing endpoints
"""
from flask import Blueprint, jsonify, request
from models import db, Network
from services.scan_service import real_scan, simulate_scan, save_networks_to_db
from auth import require_auth

network_bp = Blueprint('networks', __name__, url_prefix='/api/networks')


@network_bp.route('/scan', methods=['POST'])
@require_auth
def scan_networks():
    """
    Perform real WiFi network scan and save results
    
    Returns:
        JSON response with found networks
    """
    # Try real scan first, fallback to simulated
    networks_data = real_scan()
    saved = save_networks_to_db(db, Network, networks_data)
    return jsonify({"found": len(saved), "networks": saved}), 201


@network_bp.route('', methods=['GET'])
@require_auth
def list_networks():
    """
    List all scanned networks from database
    
    Returns:
        JSON array of network objects
    """
    nets = Network.query.all()
    return jsonify([n.to_dict() for n in nets])


@network_bp.route('/<network_id>', methods=['GET'])
@require_auth
def get_network(network_id):
    """
    Get a specific network by ID
    
    Args:
        network_id: Network ID
        
    Returns:
        JSON network object or 404
    """
    net = Network.query.filter_by(id=network_id).first()
    if not net:
        return jsonify({"error": "Network not found"}), 404
    return jsonify(net.to_dict())
