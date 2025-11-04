"""
Database Inspector
Quick script to view database contents
"""
import sqlite3
import json
from datetime import datetime

DB_PATH = 'instance/wifi_analyzer.db'

def inspect_database():
    """Inspect and display database contents"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print("=" * 60)
        print("WiFi Security Analyzer - Database Inspector")
        print("=" * 60)
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"\n📊 Tables found: {len(tables)}")
        for table in tables:
            print(f"   - {table[0]}")
        
        # Networks table
        print("\n" + "=" * 60)
        print("🌐 NETWORKS TABLE")
        print("=" * 60)
        cursor.execute("SELECT COUNT(*) FROM network")
        count = cursor.fetchone()[0]
        print(f"\nTotal networks: {count}")
        
        if count > 0:
            cursor.execute("SELECT id, ssid, bssid, channel, signal, encryption, discovered_at FROM network")
            networks = cursor.fetchall()
            
            print("\nNetworks:")
            print("-" * 60)
            for net in networks:
                print(f"\n  ID: {net[0]}")
                print(f"  SSID: {net[1]}")
                print(f"  BSSID: {net[2]}")
                print(f"  Channel: {net[3]}")
                print(f"  Signal: {net[4]} dBm")
                print(f"  Encryption: {net[5]}")
                print(f"  Discovered: {net[6]}")
                print("-" * 60)
        
        # Audits table
        print("\n" + "=" * 60)
        print("🔍 AUDITS TABLE")
        print("=" * 60)
        cursor.execute("SELECT COUNT(*) FROM audit")
        count = cursor.fetchone()[0]
        print(f"\nTotal audits: {count}")
        
        if count > 0:
            cursor.execute("SELECT id, network_bssid, started_at, result_json FROM audit")
            audits = cursor.fetchall()
            
            print("\nAudits:")
            print("-" * 60)
            for audit in audits:
                print(f"\n  Audit ID: {audit[0]}")
                print(f"  Network BSSID: {audit[1]}")
                print(f"  Started: {audit[2]}")
                
                if audit[3]:
                    try:
                        result = json.loads(audit[3])
                        print(f"  Risk Level: {result.get('risk_level', 'unknown')}")
                        print(f"  Weak Cipher: {result.get('weak_cipher', 'N/A')}")
                        print(f"  Open Network: {result.get('open_network', 'N/A')}")
                        print(f"  Signal Strength: {result.get('signal_strength', 'N/A')} dBm")
                        
                        details = result.get('details', [])
                        if details:
                            print("  Details:")
                            for detail in details:
                                print(f"    - {detail}")
                    except json.JSONDecodeError:
                        print(f"  Result: {audit[3]}")
                
                print("-" * 60)
        
        # Statistics
        print("\n" + "=" * 60)
        print("📈 STATISTICS")
        print("=" * 60)
        
        # Encryption types
        cursor.execute("SELECT encryption, COUNT(*) FROM network GROUP BY encryption")
        enc_stats = cursor.fetchall()
        print("\nEncryption Distribution:")
        for enc in enc_stats:
            print(f"  {enc[0]}: {enc[1]} network(s)")
        
        # Risk levels
        cursor.execute("SELECT result_json FROM audit WHERE result_json IS NOT NULL")
        audit_results = cursor.fetchall()
        risk_counts = {'low': 0, 'medium': 0, 'high': 0, 'unknown': 0}
        
        for result in audit_results:
            try:
                data = json.loads(result[0])
                risk = data.get('risk_level', 'unknown')
                risk_counts[risk] = risk_counts.get(risk, 0) + 1
            except:
                risk_counts['unknown'] += 1
        
        print("\nRisk Level Distribution:")
        for risk, count in risk_counts.items():
            if count > 0:
                print(f"  {risk.upper()}: {count} audit(s)")
        
        conn.close()
        
        print("\n" + "=" * 60)
        print("✅ Database inspection complete!")
        print("=" * 60)
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except FileNotFoundError:
        print(f"❌ Database file not found: {DB_PATH}")
        print("   Run the app first to create the database:")
        print("   python app_new.py")

if __name__ == "__main__":
    inspect_database()
