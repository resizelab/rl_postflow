#!/usr/bin/env python3
"""
Debug dashboard comme un navigateur
"""

import requests
import json
import time
import sys
from datetime import datetime

class DashboardDebugger:
    def __init__(self, base_url="http://127.0.0.1:8080"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def debug_html_content(self):
        """Analyse le contenu HTML comme un navigateur"""
        print("🔍 ANALYSE HTML DASHBOARD")
        print("=" * 50)
        
        try:
            response = self.session.get(self.base_url)
            html = response.text
            
            print(f"✅ Status: {response.status_code}")
            print(f"✅ Taille: {len(html)} chars")
            
            # Vérifier les éléments clés
            checks = [
                ("Title", "PostFlow Dashboard" in html),
                ("Refresh button", "refreshAll()" in html),
                ("Auto-refresh checkbox", "auto-refresh" in html),
                ("Interval correct", "10s" in html and "5s" not in html),
                ("SocketIO", "socket.io" in html),
                ("Status div", "processing-status" in html),
                ("Queue stats", "pending-count" in html),
                ("JavaScript functions", "async function refreshStatus" in html),
                ("Timeout handling", "AbortSignal.timeout" in html),
                ("Console logs", "console.log" in html)
            ]
            
            for check_name, result in checks:
                status = "✅" if result else "❌"
                print(f"{status} {check_name}")
                
            return html
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return None
    
    def simulate_browser_requests(self):
        """Simule les appels AJAX comme un navigateur"""
        print("\n🌐 SIMULATION NAVIGATEUR")
        print("=" * 50)
        
        endpoints = [
            "/api/status",
            "/api/queue/stats", 
            "/api/health",
            "/api/errors",
            "/api/tasks"
        ]
        
        for endpoint in endpoints:
            try:
                # Simulation d'un appel AJAX avec headers navigateur
                headers = {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Dashboard Debug)',
                    'X-Requested-With': 'XMLHttpRequest'
                }
                
                start_time = time.time()
                response = self.session.get(
                    f"{self.base_url}{endpoint}", 
                    headers=headers,
                    timeout=5
                )
                duration = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ {endpoint}: {response.status_code} ({duration:.2f}s)")
                    
                    # Analyser le contenu
                    if endpoint == "/api/status":
                        print(f"   - Components: {data.get('components', {})}")
                        print(f"   - Running: {data.get('running', False)}")
                        print(f"   - Timestamp: {data.get('timestamp', 'N/A')}")
                    elif endpoint == "/api/queue/stats":
                        print(f"   - Pending: {data.get('pending', 0)}")
                        print(f"   - Completed: {data.get('completed', 0)}")
                        print(f"   - Processing: {data.get('processing', 0)}")
                        print(f"   - Failed: {data.get('failed', 0)}")
                        
                else:
                    print(f"❌ {endpoint}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ {endpoint}: {e}")
    
    def test_websocket_connection(self):
        """Test la connexion WebSocket"""
        print("\n🔌 TEST WEBSOCKET")
        print("=" * 50)
        
        try:
            # Tester si socketio répond
            response = self.session.get(f"{self.base_url}/socket.io/")
            print(f"✅ SocketIO endpoint: {response.status_code}")
            
            # Vérifier la présence du script socketio dans le HTML
            html_response = self.session.get(self.base_url)
            if "cdn.socket.io" in html_response.text:
                print("✅ SocketIO CDN trouvé dans HTML")
            else:
                print("❌ SocketIO CDN manquant dans HTML")
                
        except Exception as e:
            print(f"❌ WebSocket test: {e}")
    
    def simulate_refresh_cycle(self):
        """Simule un cycle de refresh comme le navigateur"""
        print("\n🔄 SIMULATION CYCLE REFRESH")
        print("=" * 50)
        
        for i in range(3):
            print(f"\n--- Refresh #{i+1} ---")
            
            # Simuler le refreshAll() du JavaScript
            start_time = time.time()
            
            try:
                # Appels séquentiels comme dans le JS
                status_resp = self.session.get(f"{self.base_url}/api/status", timeout=5)
                queue_resp = self.session.get(f"{self.base_url}/api/queue/stats", timeout=5)
                health_resp = self.session.get(f"{self.base_url}/api/health", timeout=5)
                
                duration = time.time() - start_time
                
                if all(r.status_code == 200 for r in [status_resp, queue_resp, health_resp]):
                    print(f"✅ Cycle complet en {duration:.2f}s")
                    
                    # Vérifier cohérence des données
                    status_data = status_resp.json()
                    queue_data = queue_resp.json()
                    
                    print(f"   - Status timestamp: {status_data.get('timestamp', 'N/A')}")
                    print(f"   - Queue data: {queue_data}")
                    
                else:
                    print(f"❌ Échec du cycle")
                    
            except Exception as e:
                print(f"❌ Erreur cycle: {e}")
            
            if i < 2:  # Pause entre les cycles
                time.sleep(2)
    
    def run_full_debug(self):
        """Lance un debug complet"""
        print(f"🎬 DASHBOARD DEBUG - {datetime.now().strftime('%H:%M:%S')}")
        print("=" * 60)
        
        # 1. Test HTML
        html = self.debug_html_content()
        
        # 2. Test APIs
        self.simulate_browser_requests()
        
        # 3. Test WebSocket
        self.test_websocket_connection()
        
        # 4. Test cycle refresh
        self.simulate_refresh_cycle()
        
        print("\n" + "=" * 60)
        print("🎯 RÉSUMÉ")
        print("=" * 60)
        
        if html and "10s" in html:
            print("✅ Template HTML correct")
        else:
            print("❌ Template HTML incorrect")
            
        print("✅ Debug terminé")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = "http://127.0.0.1:8080"
    
    debugger = DashboardDebugger(url)
    debugger.run_full_debug()
