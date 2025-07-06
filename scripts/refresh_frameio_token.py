#!/usr/bin/env python3
"""
Script simple pour rafraîchir le token Frame.io OAuth
en utilisant le refresh_token existant
"""

import os
import json
import asyncio
import httpx
from pathlib import Path

async def refresh_frameio_token():
    """Rafraîchir le token Frame.io"""
    
    # Chemins des fichiers
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    refresh_token_path = Path(__file__).parent.parent / ".frameio_refresh_token"
    
    # Charger la config et le refresh token
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    with open(refresh_token_path, 'r') as f:
        refresh_token = f.read().strip()
    
    frameio_config = config.get('frameio', {})
    client_id = frameio_config.get('client_id') or os.getenv('FRAMEIO_CLIENT_ID')
    client_secret = frameio_config.get('client_secret') or os.getenv('FRAMEIO_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        print("❌ client_id ou client_secret manquant")
        return False
    
    print("🔄 Rafraîchissement du token...")
    print(f"   Client ID: {client_id}")
    print(f"   Refresh Token: {refresh_token[:20]}...")
    
    # Préparer les données pour le refresh
    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    # Tester différents endpoints OAuth (plus complets)
    oauth_endpoints = [
        "https://api.frame.io/oauth/token",
        "https://api.frame.io/oauth2/token",
        "https://api.frame.io/v4/oauth2/token", 
        "https://api.frame.io/v2/oauth2/token",
        "https://auth.frame.io/oauth2/token",
        "https://auth.frame.io/oauth/token",
        "https://api.frame.io/v4/oauth/token",
        "https://api.frame.io/v2/oauth/token",
        "https://login.frame.io/oauth2/token",
        "https://accounts.frame.io/oauth2/token"
    ]
    
    for endpoint in oauth_endpoints:
        print(f"🧪 Test endpoint: {endpoint}")
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    endpoint,
                    data=data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    token_data = response.json()
                    
                    new_access_token = token_data.get("access_token")
                    new_refresh_token = token_data.get("refresh_token")
                    
                    print("✅ Token rafraîchi avec succès!")
                    print(f"   Nouveau Access Token: {new_access_token[:20]}...")
                    
                    # Mettre à jour la config
                    config['frameio']['api_token'] = new_access_token
                    if new_refresh_token:
                        with open(refresh_token_path, 'w') as f:
                            f.write(new_refresh_token)
                        print(f"   Nouveau Refresh Token sauvegardé")
                    
                    # Sauvegarder la config
                    with open(config_path, 'w') as f:
                        json.dump(config, f, indent=4)
                    
                    print(f"💾 Configuration mise à jour dans {config_path}")
                    return True
                else:
                    print(f"   Erreur: {response.text[:200]}")
                    
        except Exception as e:
            print(f"   Exception: {e}")
        
        print()
    
    return False

if __name__ == "__main__":
    success = asyncio.run(refresh_frameio_token())
    if success:
        print("\n🎉 Token rafraîchi! Vous pouvez maintenant relancer vos scripts.")
    else:
        print("\n❌ Échec du rafraîchissement. Vous devrez peut-être refaire l'auth OAuth complète.")
