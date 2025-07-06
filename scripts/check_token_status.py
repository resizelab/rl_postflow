#!/usr/bin/env python3
"""
Vérification rapide du statut du token Frame.io
"""

import json
import requests
import base64
from pathlib import Path
from datetime import datetime

def check_current_token():
    """Vérifier le token actuel dans la configuration"""
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    
    print("🔍 VÉRIFICATION TOKEN FRAME.IO")
    print("=" * 35)
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        frameio_config = config.get('frameio', {})
        current_token = frameio_config.get('api_token')
        
        if not current_token:
            print("❌ Aucun token trouvé dans la configuration")
            return False
        
        print(f"🔑 Token présent: {current_token[:50]}...")
        
        # Analyser le token JWT
        try:
            parts = current_token.split('.')
            if len(parts) == 3:
                payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
                
                created_at = payload.get('created_at', 0)
                expires_in = payload.get('expires_in', 0)
                
                if created_at and expires_in:
                    created_date = datetime.fromtimestamp(created_at / 1000)
                    expires_timestamp = (created_at + expires_in) / 1000
                    expires_date = datetime.fromtimestamp(expires_timestamp)
                    
                    print(f"📅 Créé le: {created_date}")
                    print(f"⏰ Expire le: {expires_date}")
                    
                    if expires_timestamp < datetime.now().timestamp():
                        print("❌ TOKEN EXPIRÉ")
                        return False
                    else:
                        print("✅ Token encore valide")
        except Exception as e:
            print(f"⚠️  Impossible d'analyser l'expiration: {e}")
        
        # Tester avec Frame.io API
        print("\n🧪 Test avec Frame.io API...")
        headers = {
            'Authorization': f'Bearer {current_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get("https://api.frame.io/v2/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ TOKEN VALIDE ! Utilisateur: {user_data.get('name', 'N/A')}")
            return True
        else:
            print(f"❌ Token invalide: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    token_valid = check_current_token()
    
    print("\n📋 RÉSUMÉ:")
    if token_valid:
        print("🟢 Votre token Frame.io est valide et fonctionnel")
        print("   Aucune action requise.")
    else:
        print("🔴 Votre token Frame.io est invalide ou expiré")
        print("   Actions recommandées:")
        print("   1. Exécutez: python scripts/frameio_oauth_fixed.py")
        print("   2. Suivez les instructions pour obtenir un nouveau token")
        print("   3. Consultez: docs/ADOBE_OAUTH_TROUBLESHOOTING.md")

if __name__ == "__main__":
    main()
