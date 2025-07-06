#!/usr/bin/env python3
"""
Démo complète Frame.io v4 OAuth Web App :
- Génère l'URL d'autorisation
- Échange le code contre un access_token
- Rafraîchit le token si besoin
- Teste l'accès à l'API Frame.io
- Stocke le refresh_token pour usage ultérieur
"""
import os
import sys
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))
from src.integrations.frameio.auth import create_frameio_auth, FrameIOAuthError

load_dotenv()
REFRESH_TOKEN_PATH = Path(".frameio_refresh_token")

async def main():
    print("\n🚀 DEMO OAUTH WEB APP FRAME.IO v4\n" + "="*40)
    auth = create_frameio_auth()
    refresh_token = None
    # 1. Tenter de charger un refresh_token existant
    if REFRESH_TOKEN_PATH.exists():
        refresh_token = REFRESH_TOKEN_PATH.read_text().strip()
        print("🔄 Refresh token trouvé, tentative de refresh...")
        try:
            auth._token_info = type('TokenInfo', (), {'refresh_token': refresh_token, 'is_expired': True})()
            await auth.refresh_token()
            print(f"✅ Token rafraîchi: {auth._token_info.access_token[:20]}...")
        except Exception as e:
            print(f"❌ Échec du refresh: {e}")
            refresh_token = None
    # 2. Si pas de refresh_token, demander le code d'autorisation
    if not refresh_token or not auth._token_info or not hasattr(auth._token_info, 'access_token'):
        print("➡️  Ouvrez cette URL dans votre navigateur et autorisez l'application :\n")
        print(auth.get_authorization_url())
        code = os.getenv('FRAMEIO_AUTH_CODE') or input("\nCollez ici le code d'autorisation : ").strip()
        try:
            await auth.exchange_code_for_token(code)
            print(f"✅ Token obtenu: {auth._token_info.access_token[:20]}...")
            # Stocker le refresh_token pour la prochaine fois
            if auth._token_info.refresh_token:
                REFRESH_TOKEN_PATH.write_text(auth._token_info.refresh_token)
                print(f"💾 Refresh token sauvegardé dans {REFRESH_TOKEN_PATH}")
        except Exception as e:
            print(f"❌ Erreur d'authentification: {e}")
            return
    # 3. Test API Frame.io
    print("➡️  Test accès API Frame.io /accounts...")
    url = f"{auth.base_url}/accounts"
    try:
        resp = await auth.make_authenticated_request("GET", url)
        if resp.status_code == 200:
            print("✅ Accès API /accounts OK")
            print(json.dumps(resp.json(), indent=2))
        else:
            print(f"❌ Erreur API /accounts: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"❌ Exception API: {e}")
    finally:
        await auth.close()

if __name__ == "__main__":
    asyncio.run(main())
