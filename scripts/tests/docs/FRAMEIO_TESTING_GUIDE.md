# Guide de Test de l'Intégration Frame.io

## Vue d'ensemble
Ce guide fournit une approche complète pour tester l'intégration LucidLink → Frame.io du pipeline RL PostFlow. Il couvre les tests unitaires, d'intégration, et de validation en production.

## Types de Tests

### 1. Tests Unitaires
Tests individuels de chaque module sans dépendances externes.

### 2. Tests d'Intégration
Tests de l'interaction entre modules avec des mocks d'API.

### 3. Tests de Connectivité
Tests des connexions réelles aux services Frame.io et Discord.

### 4. Tests de Workflow Complet
Tests du workflow end-to-end avec des fichiers réels.

## Prérequis

### Configuration requise
```bash
# Installation des dépendances de test
pip install pytest pytest-asyncio pytest-mock pytest-cov

# Variables d'environnement
export FRAMEIO_TOKEN="your_frameio_token"
export DISCORD_WEBHOOK_URL="your_discord_webhook"
export FRAMEIO_TEAM_ID="your_team_id"
export FRAMEIO_PROJECT_ID="your_project_id"
```

### Fichiers de configuration
- `config/frameio_integration.json` : Configuration principale
- `config/frameio_structure.json` : Cache de structure
- `data/postflow.db` : Base de données pipeline

## Exécution des Tests

### 1. Tests Unitaires Rapides
```bash
# Exécuter tous les tests unitaires
python -m pytest tests/test_frameio_integration.py::TestFrameIOParser -v

# Tests individuels
python -m pytest tests/test_frameio_integration.py::TestFrameIOParser::test_parse_simple_filename -v
python -m pytest tests/test_frameio_integration.py::TestFrameIOParser::test_parse_complex_filename -v
python -m pytest tests/test_frameio_integration.py::TestFrameIOParser::test_supported_extensions -v
```

### 2. Tests d'Intégration
```bash
# Tests de structure (avec mocks)
python -m pytest tests/test_frameio_integration.py::TestFrameIOStructure -v

# Tests d'upload (avec mocks)
python -m pytest tests/test_frameio_integration.py::TestFrameIOUpload -v

# Tests de notification (avec mocks)
python -m pytest tests/test_frameio_integration.py::TestFrameIONotifier -v
```

### 3. Tests de Connectivité (nécessitent les vraies API)
```bash
# Test de connexion Frame.io
python -m pytest tests/test_frameio_integration.py::TestFrameIOConnectivity::test_frameio_auth -v

# Test de connexion Discord
python -m pytest tests/test_frameio_integration.py::TestFrameIOConnectivity::test_discord_connectivity -v
```

### 4. Tests de Workflow Complet
```bash
# Test du workflow complet (nécessite des fichiers de test)
python -m pytest tests/test_frameio_integration.py::TestFrameIOWorkflow::test_complete_workflow -v
```

## Tests Interactifs

### 1. Démo Interactive
```bash
# Exécuter la démo complète
python examples/frameio_lucidlink_demo.py

# Options disponibles :
# 1. Test du parser
# 2. Test de structure
# 3. Test d'upload
# 4. Test de notification
# 5. Test du workflow complet
```

### 2. Tests Manuels avec Scripts

#### Test du Parser
```bash
# Script de test du parser
python -c "
from src.integrations.frameio.parser import FrameIOFileParser
parser = FrameIOFileParser()

# Test avec différents fichiers
test_files = [
    'SC01_UNDLM_00412_V002.mov',
    '13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov',
    'SCENE_42_SHOT_001_V003.r3d'
]

for filename in test_files:
    metadata = parser.parse_filename(filename)
    if metadata:
        print(f'✅ {filename} → {metadata.nomenclature}')
    else:
        print(f'❌ {filename} → Parse failed')
"
```

#### Test de Structure
```bash
# Script de test de structure
python -c "
import asyncio
from src.integrations.frameio.structure import FrameIOStructureManager

async def test_structure():
    manager = FrameIOStructureManager()
    
    # Test de création de structure
    structure = await manager.ensure_shot_structure('SC01', 'UNDLM_00412')
    print(f'Structure créée: {structure}')

asyncio.run(test_structure())
"
```

### 3. Tests avec Fichiers Réels

#### Préparation des fichiers de test
```bash
# Créer un dossier de test
mkdir -p /tmp/frameio_test_files

# Créer des fichiers de test (ou copier de vrais fichiers)
touch /tmp/frameio_test_files/SC01_UNDLM_00412_V002.mov
touch /tmp/frameio_test_files/13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov
touch /tmp/frameio_test_files/SCENE_42_SHOT_001_V003.r3d
```

#### Test d'upload avec fichiers réels
```bash
# Script de test d'upload
python -c "
import asyncio
from pathlib import Path
from src.integrations.frameio.integration import FrameIOIntegration

async def test_upload():
    integration = FrameIOIntegration()
    
    test_file = Path('/tmp/frameio_test_files/SC01_UNDLM_00412_V002.mov')
    if test_file.exists():
        result = await integration.process_file(test_file)
        print(f'Upload result: {result}')
    else:
        print('❌ Test file not found')

asyncio.run(test_upload())
"
```

## Monitoring et Validation

### 1. Monitoring du Bridge
```bash
# Surveiller le bridge en temps réel
python scripts/monitor_frameio_integration.py

# Vérifier les logs
tail -f logs/frameio_bridge.log
```

### 2. Validation des Uploads
```bash
# Vérifier les uploads récents
python -c "
from src.integrations.frameio.structure import FrameIOStructureManager
import asyncio

async def check_uploads():
    manager = FrameIOStructureManager()
    recent_uploads = await manager.get_recent_uploads()
    print(f'Uploads récents: {len(recent_uploads)}')
    for upload in recent_uploads:
        print(f'  - {upload}')

asyncio.run(check_uploads())
"
```

## Scénarios de Test Avancés

### 1. Test de Gestion d'Erreurs
```bash
# Test avec fichier corrompu
python -c "
import asyncio
from src.integrations.frameio.integration import FrameIOIntegration

async def test_error_handling():
    integration = FrameIOIntegration()
    
    # Test avec fichier inexistant
    try:
        result = await integration.process_file('/path/to/nonexistent/file.mov')
        print(f'Résultat: {result}')
    except Exception as e:
        print(f'Erreur capturée: {e}')

asyncio.run(test_error_handling())
"
```

### 2. Test de Performance
```bash
# Test de performance avec plusieurs fichiers
python -c "
import asyncio
import time
from src.integrations.frameio.integration import FrameIOIntegration

async def test_performance():
    integration = FrameIOIntegration()
    
    start_time = time.time()
    
    # Traiter plusieurs fichiers en parallèle
    tasks = []
    for i in range(5):
        # Utiliser des fichiers de test
        task = integration.process_file(f'/tmp/frameio_test_files/test_{i}.mov')
        tasks.append(task)
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    end_time = time.time()
    print(f'Traitement de {len(tasks)} fichiers en {end_time - start_time:.2f}s')
    
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f'  Fichier {i}: Erreur - {result}')
        else:
            print(f'  Fichier {i}: {result.get("status", "Unknown")}')

asyncio.run(test_performance())
"
```

## Validation de Production

### 1. Tests de Charge
```bash
# Test avec un grand nombre de fichiers
python -c "
import asyncio
from concurrent.futures import ThreadPoolExecutor
from src.workflows.lucidlink_frameio_bridge import LucidLinkFrameIOBridge

async def test_load():
    bridge = LucidLinkFrameIOBridge()
    
    # Simuler l'arrivée de nombreux fichiers
    test_files = [f'/tmp/frameio_test_files/test_{i}.mov' for i in range(100)]
    
    start_time = time.time()
    
    # Traiter en parallèle
    with ThreadPoolExecutor(max_workers=10) as executor:
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(executor, bridge.process_file, file_path)
            for file_path in test_files
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
    
    end_time = time.time()
    print(f'Traitement de {len(test_files)} fichiers en {end_time - start_time:.2f}s')

asyncio.run(test_load())
"
```

### 2. Tests de Résilience
```bash
# Test de récupération après panne
python -c "
import asyncio
from src.workflows.lucidlink_frameio_bridge import LucidLinkFrameIOBridge

async def test_resilience():
    bridge = LucidLinkFrameIOBridge()
    
    # Simuler une panne réseau
    print('Test de résilience...')
    
    # Le bridge devrait reprendre automatiquement
    await bridge.start_monitoring()

asyncio.run(test_resilience())
"
```

## Rapports de Test

### 1. Génération de Rapport de Couverture
```bash
# Générer un rapport de couverture
python -m pytest tests/test_frameio_integration.py --cov=src.integrations.frameio --cov-report=html

# Voir le rapport dans output/htmlcov/index.html
```

### 2. Rapport de Performance
```bash
# Générer des métriques de performance
python scripts/monitor_frameio_integration.py --report > output/performance_report.json
```

## Résolution des Problèmes

### Problèmes Courants

1. **Erreur d'authentification Frame.io**
   - Vérifier le token dans `config/frameio_integration.json`
   - Tester la connexion : `python -c "from src.integrations.frameio.auth import FrameIOAuth; print(FrameIOAuth().test_connection())"`

2. **Problème de parsing**
   - Tester le parser individuellement
   - Vérifier les patterns de nomenclature

3. **Erreur d'upload**
   - Vérifier les permissions Frame.io
   - Tester avec un fichier plus petit

4. **Notifications Discord manquantes**
   - Vérifier l'URL du webhook
   - Tester la connexion Discord

### Logs de Debug
```bash
# Activer les logs détaillés
export FRAMEIO_DEBUG=1
export FRAMEIO_LOG_LEVEL=DEBUG

# Voir les logs en temps réel
tail -f logs/frameio_integration.log
```

## Conclusion

Cette suite de tests complète permet de valider tous les aspects de l'intégration Frame.io :

1. **Tests unitaires** : Validation des modules individuels
2. **Tests d'intégration** : Validation des interactions entre modules
3. **Tests de connectivité** : Validation des connexions aux services
4. **Tests de workflow** : Validation du processus complet
5. **Tests de performance** : Validation de la charge et de la résilience

Utilisez ces tests de manière progressive, en commençant par les tests unitaires avant de passer aux tests d'intégration et de production.
