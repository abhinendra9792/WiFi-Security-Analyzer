"""
WiFi Network Scanning Service
Provides simulated and real WiFi network scanning functionality
"""
import uuid
import datetime
import time


def real_scan():
    """
    Perform real WiFi network scan using pywifi
    
    Returns:
        list: List of detected network dictionaries
    """
    try:
        import pywifi
        from pywifi import const
        
        # Initialize WiFi
        wifi = pywifi.PyWiFi()
        iface = wifi.interfaces()[0]  # Get first wireless interface
        
        # Start scan
        iface.scan()
        time.sleep(2)  # Wait for scan to complete
        
        # Get scan results
        scan_results = iface.scan_results()
        networks = []
        
        for network in scan_results:
            # Get encryption type
            if network.akm[0] == const.AKM_TYPE_NONE:
                encryption = "Open"
            elif const.AKM_TYPE_WPA2PSK in network.akm:
                encryption = "WPA2-PSK"
            elif const.AKM_TYPE_WPAPSK in network.akm:
                encryption = "WPA-PSK"
            elif const.AKM_TYPE_WPA2 in network.akm:
                encryption = "WPA2-Enterprise"
            else:
                encryption = "WEP"
            
            # Calculate channel from frequency
            freq = getattr(network, 'freq', 0)
            if 2412 <= freq <= 2484:
                channel = (freq - 2412) // 5 + 1
            elif 5170 <= freq <= 5825:
                channel = (freq - 5000) // 5
            else:
                channel = 0
            
            networks.append({
                "ssid": network.ssid if network.ssid else "Hidden Network",
                "bssid": network.bssid,
                "channel": channel,
                "signal": network.signal,
                "encryption": encryption
            })
        
        # Remove duplicates based on BSSID
        unique_networks = {n['bssid']: n for n in networks}.values()
        return list(unique_networks)
        
    except Exception as e:
        print(f"Real scan error: {e}")
        # Fallback to simulated scan
        return simulate_scan()


def simulate_scan():
    """
    Simulate a WiFi network scan with mock data
    
    Returns:
        list: List of simulated network dictionaries
    """
    sample_networks = [
        {
            "ssid": "HomeNetwork",
            "bssid": "AA:BB:CC:11:22:33",
            "channel": 6,
            "signal": -50,
            "encryption": "WPA2"
        },
        {
            "ssid": "CoffeeShop",
            "bssid": "12:34:56:AA:BB:CC",
            "channel": 11,
            "signal": -70,
            "encryption": "Open"
        },
        {
            "ssid": "OfficeNet",
            "bssid": "DE:AD:BE:EF:00:01",
            "channel": 1,
            "signal": -60,
            "encryption": "WPA3"
        }
    ]
    return sample_networks


def perform_security_audit(network):
    """
    Perform basic security audit on a network
    
    Args:
        network: Network model object
        
    Returns:
        dict: Audit results with security findings
    """
    result = {
        "weak_cipher": False if network.encryption and "WPA3" in network.encryption else True,
        "open_network": True if network.encryption and network.encryption.lower() == "open" else False,
        "signal_strength": network.signal,
        "risk_level": "low"
    }
    
    # Determine risk level
    if result["open_network"]:
        result["risk_level"] = "high"
    elif result["weak_cipher"]:
        result["risk_level"] = "medium"
    
    result["details"] = []
    if result["open_network"]:
        result["details"].append("Network is unencrypted and vulnerable to eavesdropping")
    if result["weak_cipher"]:
        result["details"].append("Network uses weak encryption that may be vulnerable")
    if network.signal > -50:
        result["details"].append("Strong signal strength detected")
    
    return result


def save_networks_to_db(db, Network, networks_data):
    """
    Save scanned networks to database
    
    Args:
        db: SQLAlchemy database instance
        Network: Network model class
        networks_data: List of network dictionaries
        
    Returns:
        list: List of saved network dictionaries
    """
    saved = []
    for n in networks_data:
        net = Network(
            id=str(uuid.uuid4()),
            ssid=n["ssid"],
            bssid=n["bssid"],
            channel=n["channel"],
            signal=n["signal"],
            encryption=n["encryption"]
        )
        db.session.add(net)
        saved.append(net.to_dict())
    db.session.commit()
    return saved
