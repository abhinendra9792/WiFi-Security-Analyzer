"""
Test real WiFi scanning functionality
Run this to check if pywifi can detect your WiFi adapter and scan networks
"""
import time

print("Testing WiFi scanning...")
print("-" * 50)

try:
    import pywifi
    from pywifi import const
    print("✓ pywifi module imported successfully")
    
    # Initialize WiFi
    wifi = pywifi.PyWiFi()
    print(f"✓ PyWiFi initialized")
    
    # Get interfaces
    interfaces = wifi.interfaces()
    print(f"✓ Found {len(interfaces)} WiFi interface(s)")
    
    if len(interfaces) == 0:
        print("✗ ERROR: No WiFi interfaces found!")
        print("  This could mean:")
        print("  - Your WiFi adapter is disabled")
        print("  - You need to run as Administrator")
        print("  - pywifi doesn't support your WiFi adapter")
        exit(1)
    
    # Use first interface
    iface = interfaces[0]
    print(f"✓ Using interface: {iface.name()}")
    print(f"  Status: {iface.status()}")
    
    # Start scan
    print("\n🔍 Starting WiFi scan...")
    iface.scan()
    time.sleep(3)  # Wait for scan to complete
    
    # Get results
    scan_results = iface.scan_results()
    print(f"✓ Scan completed! Found {len(scan_results)} networks")
    print("-" * 50)
    
    if len(scan_results) == 0:
        print("⚠ WARNING: No networks found!")
        print("  This could mean:")
        print("  - WiFi is disabled")
        print("  - You need Administrator privileges")
        print("  - The scan didn't complete properly")
    else:
        print("\n📡 Networks found:")
        for i, network in enumerate(scan_results, 1):
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
                encryption = f"Other (akm={network.akm})"
            
            ssid = network.ssid if network.ssid else "<Hidden>"
            print(f"\n{i}. {ssid}")
            print(f"   BSSID: {network.bssid}")
            print(f"   Signal: {network.signal} dBm")
            print(f"   Encryption: {encryption}")
            if hasattr(network, 'freq'):
                channel = network.freq // 1000
                print(f"   Channel: ~{channel}")
    
except ImportError as e:
    print(f"✗ ERROR: Failed to import pywifi: {e}")
    print("  Try installing: pip install pywifi comtypes")
except Exception as e:
    print(f"✗ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "-" * 50)
print("Test completed!")
