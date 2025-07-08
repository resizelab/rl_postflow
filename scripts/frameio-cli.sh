#!/bin/bash
# Script d'Usage Quotidien - Intégration Frame.io
# Commandes rapides pour tester et utiliser l'intégration

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Affichage du header
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}🎬 FRAME.IO INTEGRATION - USAGE QUOTIDIEN${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Fonction d'aide
show_help() {
    echo -e "${YELLOW}Usage: $0 [COMMANDE]${NC}"
    echo ""
    echo "Commandes disponibles:"
    echo "  test          - Tests rapides de base"
    echo "  interactive   - Testeur interactif"
    echo "  validate      - Validation complète"
    echo "  parse [FILE]  - Tester le parser sur un fichier"
    echo "  demo          - Démo complète"
    echo "  deploy        - Déploiement en production"
    echo "  monitor       - Monitoring du système"
    echo "  logs          - Voir les logs récents"
    echo "  status        - Statut du système"
    echo "  help          - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 test"
    echo "  $0 parse SC01_UNDLM_00412_V002.mov"
    echo "  $0 interactive"
}

# Test rapide
run_quick_test() {
    echo -e "${GREEN}🚀 Exécution des tests rapides...${NC}"
    python scripts/test_frameio_quick.py
}

# Test interactif
run_interactive_test() {
    echo -e "${GREEN}🎮 Lancement du testeur interactif...${NC}"
    python scripts/test_frameio_interactive.py
}

# Validation complète
run_validation() {
    echo -e "${GREEN}✅ Validation complète...${NC}"
    python scripts/validate_frameio_integration.py
}

# Test du parser
test_parser() {
    local filename="$1"
    if [ -z "$filename" ]; then
        echo -e "${RED}❌ Nom de fichier requis${NC}"
        echo "Usage: $0 parse [FILENAME]"
        exit 1
    fi
    
    echo -e "${GREEN}🔍 Test du parser sur: $filename${NC}"
    python -c "
import sys
sys.path.insert(0, '.')
from src.integrations.frameio.parser import FrameIOFileParser

parser = FrameIOFileParser()
metadata = parser.parse_filename('$filename')

if metadata:
    print(f'✅ Fichier parsé avec succès!')
    print(f'  📂 Scène: {metadata.scene_name}')
    print(f'  🎬 Shot: {metadata.shot_id}')
    print(f'  📊 Version: {metadata.version}')
    print(f'  🏷️  Nomenclature: {metadata.nomenclature}')
    print(f'  🎯 Extension: {metadata.file_extension}')
    print(f'  📝 Description: {metadata.description}')
    print(f'  🏷️  Tags: {metadata.tags}')
else:
    print('❌ Parsing échoué - Format non reconnu')
"
}

# Démo complète
run_demo() {
    echo -e "${GREEN}🎭 Lancement de la démo complète...${NC}"
    python examples/frameio_lucidlink_demo.py
}

# Déploiement
run_deploy() {
    echo -e "${GREEN}🚀 Déploiement en production...${NC}"
    if [ -f "scripts/deploy_frameio_integration.sh" ]; then
        bash scripts/deploy_frameio_integration.sh
    else
        echo -e "${RED}❌ Script de déploiement non trouvé${NC}"
        exit 1
    fi
}

# Monitoring
run_monitor() {
    echo -e "${GREEN}📊 Monitoring du système...${NC}"
    python scripts/monitor_frameio_integration.py
}

# Voir les logs
show_logs() {
    echo -e "${GREEN}📋 Logs récents...${NC}"
    
    log_files=("logs/frameio_integration.log" "logs/frameio_bridge.log" "logs/pipeline.log")
    
    for log_file in "${log_files[@]}"; do
        if [ -f "$log_file" ]; then
            echo -e "${BLUE}📄 $log_file (10 dernières lignes):${NC}"
            tail -n 10 "$log_file"
            echo ""
        else
            echo -e "${YELLOW}⚠️  $log_file non trouvé${NC}"
        fi
    done
}

# Statut du système
show_status() {
    echo -e "${GREEN}📊 Statut du système...${NC}"
    
    # Vérifier les services
    echo -e "${BLUE}🔧 Services:${NC}"
    if systemctl is-active --quiet frameio-bridge.service 2>/dev/null; then
        echo "  ✅ frameio-bridge.service: actif"
    else
        echo "  ❌ frameio-bridge.service: inactif"
    fi
    
    # Vérifier les fichiers importants
    echo -e "${BLUE}📁 Fichiers:${NC}"
    files=("config/frameio_integration.json" "data/postflow.db" "logs/frameio_integration.log")
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            echo "  ✅ $file ($size)"
        else
            echo "  ❌ $file: manquant"
        fi
    done
    
    # Vérifier la configuration
    echo -e "${BLUE}⚙️  Configuration:${NC}"
    if [ -n "$FRAMEIO_TOKEN" ]; then
        echo "  ✅ FRAMEIO_TOKEN: configuré"
    else
        echo "  ❌ FRAMEIO_TOKEN: manquant"
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        echo "  ✅ DISCORD_WEBHOOK_URL: configuré"
    else
        echo "  ❌ DISCORD_WEBHOOK_URL: manquant"
    fi
}

# Fonction principale
main() {
    case "$1" in
        "test")
            run_quick_test
            ;;
        "interactive")
            run_interactive_test
            ;;
        "validate")
            run_validation
            ;;
        "parse")
            test_parser "$2"
            ;;
        "demo")
            run_demo
            ;;
        "deploy")
            run_deploy
            ;;
        "monitor")
            run_monitor
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            echo -e "${YELLOW}⚠️  Commande manquante${NC}"
            show_help
            ;;
        *)
            echo -e "${RED}❌ Commande inconnue: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "src/integrations/frameio" ]; then
    echo -e "${RED}❌ Erreur: Exécutez ce script depuis la racine du projet RL PostFlow${NC}"
    exit 1
fi

# Exécuter la fonction principale
main "$@"
