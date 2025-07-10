#!/usr/bin/env python3
"""
🕐 Test Timestamp Paris
======================

Test du timestamp avec fuseau horaire Paris pour vérifier la correction.
"""

import sys
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from datetime import datetime
import pytz

# Test des fuseaux horaires
print("🕐 TEST TIMESTAMP PARIS")
print("=" * 30)

# Heure UTC
utc_time = datetime.utcnow()
print(f"⏰ UTC        : {utc_time.strftime('%H:%M:%S')}")

# Heure locale (système)
local_time = datetime.now()
print(f"🏠 Local      : {local_time.strftime('%H:%M:%S')}")

# Heure Paris
paris_tz = pytz.timezone('Europe/Paris')
paris_time = datetime.now(paris_tz)
print(f"🇫🇷 Paris      : {paris_time.strftime('%H:%M:%S')}")

print(f"\n📅 Date complète Paris : {paris_time.strftime('%d/%m/%Y à %H:%M:%S')}")
print(f"🔗 ISO format         : {paris_time.isoformat()}")

# Test avec la fonction du module
try:
    from src.integrations.discord.user_notifier import get_paris_time
    module_time = get_paris_time()
    print(f"📦 Module (Paris)     : {module_time.strftime('%H:%M:%S')}")
    print(f"✅ Fonction OK        : {module_time.isoformat()}")
except Exception as e:
    print(f"❌ Erreur module      : {e}")

print("\n" + "=" * 30)
print("✅ Test terminé - Vérifiez que l'heure Paris correspond à votre heure locale !")
