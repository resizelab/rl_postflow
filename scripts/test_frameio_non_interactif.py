#!/usr/bin/env python3
"""
Test non interactif de connexion Frame.io v4 via OAuth Web App
- Utilise un code d'autorisation déjà obtenu (FRAMEIO_AUTH_CODE)
- Échange le code contre un access_token
- Teste l'accès à l'API Frame.io
"""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))
from src.integrations.frameio.auth import create_frameio_auth, FrameIOAuthError

load_dotenv()

def get_auth_code():
    code = os.getenv('FRAMEIO_AUTH_CODE')
    if not code:
        print("❌ Veuillez définir FRAMEIO_AUTH_CODE dans votre .env ou dans le script.")
        exit(1)
    return code.strip()

async def main():
    print("🔐 TEST NON INTERACTIF OAUTH WEB APP FRAME.IO")
    print("="*50)
    code = get_auth_code()
    auth = create_frameio_auth()
    try:
        print("➡️  Échange du code d'autorisation contre un access_token...")
        token_info = await auth.exchange_code_for_token(code)
        print(f"✅ Token obtenu: {token_info.access_token[:20]}... (expire dans {token_info.expires_in}s)")
        print("➡️  Test accès API Frame.io /accounts...")
        url = f"{auth.base_url}/accounts"
        resp = await auth.make_authenticated_request("GET", url)
        if resp.status_code == 200:
            print("✅ Accès API /accounts OK")
            print(resp.json())
        else:
            print(f"❌ Erreur API /accounts: {resp.status_code} - {resp.text}")
    except FrameIOAuthError as e:
        print(f"❌ Erreur d'authentification: {e}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    finally:
        await auth.close()

if __name__ == "__main__":
    asyncio.run(main())
