#!/usr/bin/env python3
"""
Script pour tester le dashboard en mode autonome
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8080"

def test_endpoints():
    """Test tous les endpoints du dashboard"""
    endpoints = [
        '/api/status',
        '/api/queue/stats', 
        '/api/health',
        '/api/errors',
        '/api/tasks'
    ]
    
    print(f"🧪 Test des endpoints du dashboard - {datetime.now().strftime('%H:%M:%S')}")
    print("=" * 60)
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint}: {len(json.dumps(data))} chars")
                
                # Afficher quelques clés importantes
                if endpoint == '/api/status':
                    print(f"   - Composants: {data.get('components', {})}")
                    print(f"   - Running: {data.get('running', False)}")
                elif endpoint == '/api/queue/stats':
                    print(f"   - Pending: {data.get('pending', 0)}")
                    print(f"   - Completed: {data.get('completed', 0)}")
                elif endpoint == '/api/health':
                    print(f"   - Status: {data.get('status', {}).get('healthy', False)}")
                    
            else:
                print(f"❌ {endpoint}: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"❌ {endpoint}: {e}")
    
    print()

def test_dashboard_page():
    """Test la page principale du dashboard"""
    try:
        response = requests.get(BASE_URL, timeout=5)
        if response.status_code == 200:
            html = response.text
            print(f"✅ Dashboard HTML: {len(html)} chars")
            
            # Vérifier la présence du JavaScript
            if 'refreshAll' in html:
                print("   - JavaScript refreshAll trouvé")
            if 'socket.io' in html:
                print("   - SocketIO trouvé")
            if 'fetch(' in html:
                print("   - Appels AJAX trouvés")
        else:
            print(f"❌ Dashboard: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard: {e}")

if __name__ == "__main__":
    print("🎬 RL PostFlow Dashboard - Test")
    print("Ctrl+C pour arrêter")
    
    try:
        while True:
            test_endpoints()
            test_dashboard_page()
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n🛑 Test arrêté")
