"""
Audit Routes
Handles security audit operations and reporting
"""
from flask import Blueprint, jsonify, request
import datetime
import uuid
import csv
import io
from models import db, Network, Audit
from services.scan_service import perform_security_audit
from auth import require_auth

audit_bp = Blueprint('audits', __name__, url_prefix='/api/audits')


@audit_bp.route('/start/<bssid>', methods=['POST'])
@require_auth
def start_audit(bssid):
    """
    Start a security audit for a specific network
    
    Args:
        bssid: Network BSSID
        
    Returns:
        JSON audit results
    """
    net = Network.query.filter_by(bssid=bssid).first()
    if not net:
        return jsonify({"error": "Network not found"}), 404

    result = perform_security_audit(net)

    audit = Audit(
        id=str(uuid.uuid4()),
        network_bssid=bssid,
        started_at=datetime.datetime.utcnow(),
        result=result
    )
    db.session.add(audit)
    db.session.commit()
    
    return jsonify({"audit_id": audit.id, "result": result}), 201


@audit_bp.route('', methods=['GET'])
@require_auth
def list_audits():
    """
    List all audits
    
    Returns:
        JSON array of audit objects
    """
    audits = Audit.query.all()
    return jsonify([a.to_dict() for a in audits])


@audit_bp.route('/<audit_id>', methods=['GET'])
@require_auth
def get_audit(audit_id):
    """
    Get a specific audit by ID
    
    Args:
        audit_id: Audit ID
        
    Returns:
        JSON audit object or 404
    """
    a = Audit.query.filter_by(id=audit_id).first()
    if not a:
        return jsonify({"error": "Audit not found"}), 404
    return jsonify(a.to_dict())


@audit_bp.route('/export', methods=['GET'])
@require_auth
def export_audits():
    """
    Export all audits as JSON or CSV
    
    Query params:
        format: 'json' or 'csv' (default: json)
        
    Returns:
        Exported data in requested format
    """
    export_format = request.args.get('format', 'json').lower()
    audits = Audit.query.all()
    
    if export_format == 'csv':
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Audit ID', 'Network BSSID', 'Started At', 'Risk Level', 'Details'])
        
        for audit in audits:
            result = audit.result or {}
            writer.writerow([
                audit.id,
                audit.network_bssid,
                audit.started_at.isoformat() if audit.started_at else '',
                result.get('risk_level', 'unknown'),
                '; '.join(result.get('details', []))
            ])
        
        output.seek(0)
        return output.getvalue(), 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=audits.csv'
        }
    
    # Default: JSON export
    return jsonify({
        "export_date": datetime.datetime.utcnow().isoformat() + "Z",
        "total_audits": len(audits),
        "audits": [a.to_dict() for a in audits]
    })
