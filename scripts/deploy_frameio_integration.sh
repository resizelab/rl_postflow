#!/bin/bash
"""
Script de déploiement automatisé pour l'intégration LucidLink → Frame.io
Configure l'environnement, installe les dépendances et démarre le service
"""

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configuration par défaut
PROJECT_DIR="/opt/rl_postflow"
SERVICE_USER="postflow"
SERVICE_GROUP="postflow"
PYTHON_VERSION="3.9"
VENV_DIR="$PROJECT_DIR/venv"

# Vérifier les permissions root
if [[ $EUID -ne 0 ]]; then
   error "Ce script doit être exécuté en tant que root (sudo)"
   exit 1
fi

log "🚀 Démarrage du déploiement RL PostFlow - Frame.io Integration"

# Étape 1: Vérifier les prérequis système
log "📋 Vérification des prérequis système..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    error "Python 3 n'est pas installé"
    exit 1
fi

PYTHON_VER=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
if [[ $(echo "$PYTHON_VER < 3.8" | bc) -eq 1 ]]; then
    error "Python 3.8+ requis (version détectée: $PYTHON_VER)"
    exit 1
fi

log "✅ Python $PYTHON_VER détecté"

# Vérifier pip
if ! command -v pip3 &> /dev/null; then
    error "pip3 n'est pas installé"
    exit 1
fi

# Étape 2: Créer l'utilisateur et le groupe
log "👤 Configuration de l'utilisateur système..."

if ! id "$SERVICE_USER" &>/dev/null; then
    useradd -r -s /bin/false -d "$PROJECT_DIR" "$SERVICE_USER"
    log "✅ Utilisateur $SERVICE_USER créé"
else
    log "✅ Utilisateur $SERVICE_USER existe déjà"
fi

# Étape 3: Créer la structure de dossiers
log "📁 Création de la structure de dossiers..."

mkdir -p "$PROJECT_DIR"/{src,config,logs,data,backups,temp}
mkdir -p "$PROJECT_DIR"/logs/archive
mkdir -p "$PROJECT_DIR"/data/{processed,failed}
mkdir -p "$PROJECT_DIR"/backups/{config,data}

# Étape 4: Copier les fichiers du projet
log "📦 Copie des fichiers du projet..."

# Déterminer le répertoire source
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
info "Source: $SOURCE_DIR"

# Copier les fichiers
cp -r "$SOURCE_DIR"/src/* "$PROJECT_DIR"/src/
cp -r "$SOURCE_DIR"/config/* "$PROJECT_DIR"/config/ 2>/dev/null || true
cp -r "$SOURCE_DIR"/systemd "$PROJECT_DIR"/
cp -r "$SOURCE_DIR"/requirements*.txt "$PROJECT_DIR"/ 2>/dev/null || true

log "✅ Fichiers copiés"

# Étape 5: Créer l'environnement virtuel Python
log "🐍 Configuration de l'environnement virtuel Python..."

if [[ ! -d "$VENV_DIR" ]]; then
    python3 -m venv "$VENV_DIR"
    log "✅ Environnement virtuel créé"
else
    log "✅ Environnement virtuel existe déjà"
fi

# Activer l'environnement virtuel
source "$VENV_DIR/bin/activate"

# Mettre à jour pip
"$VENV_DIR/bin/pip" install --upgrade pip

# Installer les dépendances
if [[ -f "$PROJECT_DIR/requirements.txt" ]]; then
    "$VENV_DIR/bin/pip" install -r "$PROJECT_DIR/requirements.txt"
    log "✅ Dépendances installées"
else
    # Installer les dépendances minimales
    "$VENV_DIR/bin/pip" install asyncio httpx requests python-dotenv
    log "✅ Dépendances minimales installées"
fi

# Étape 6: Configurer les permissions
log "🔐 Configuration des permissions..."

chown -R "$SERVICE_USER:$SERVICE_GROUP" "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"
chmod -R 644 "$PROJECT_DIR"/config/*
chmod -R 755 "$PROJECT_DIR"/src
chmod +x "$PROJECT_DIR"/src/workflows/lucidlink_frameio_bridge.py

log "✅ Permissions configurées"

# Étape 7: Configurer le service systemd
log "⚙️ Configuration du service systemd..."

# Copier le fichier de service
cp "$PROJECT_DIR/systemd/frameio-bridge.service" /etc/systemd/system/

# Recharger systemd
systemctl daemon-reload

# Activer le service (mais ne pas le démarrer automatiquement)
systemctl enable frameio-bridge.service

log "✅ Service systemd configuré"

# Étape 8: Créer les fichiers de configuration
log "📄 Configuration des fichiers de config..."

# Créer le fichier de configuration principal s'il n'existe pas
if [[ ! -f "$PROJECT_DIR/config/frameio_integration.json" ]]; then
    if [[ -f "$PROJECT_DIR/config/frameio_integration.json.example" ]]; then
        cp "$PROJECT_DIR/config/frameio_integration.json.example" "$PROJECT_DIR/config/frameio_integration.json"
        log "✅ Configuration créée depuis l'exemple"
    else
        # Créer une configuration minimale
        cat > "$PROJECT_DIR/config/frameio_integration.json" << 'EOF'
{
  "frameio": {
    "account_id": null,
    "workspace_id": null,
    "project_id": null,
    "oauth": {
      "client_id": null,
      "client_secret": null,
      "jwt_key": null
    }
  },
  "discord": {
    "webhook_url": null
  },
  "lucidlink": {
    "by_shot_path": "/path/to/lucidlink/BY_SHOT"
  }
}
EOF
        log "✅ Configuration minimale créée"
    fi
fi

# Créer le fichier .env s'il n'existe pas
if [[ ! -f "$PROJECT_DIR/.env" ]]; then
    cat > "$PROJECT_DIR/.env" << 'EOF'
# Frame.io Configuration
FRAMEIO_ACCOUNT_ID=your_account_id
FRAMEIO_WORKSPACE_ID=your_workspace_id
FRAMEIO_PROJECT_ID=your_project_id
FRAMEIO_CLIENT_ID=your_client_id
FRAMEIO_CLIENT_SECRET=your_client_secret
FRAMEIO_JWT_KEY=your_jwt_key

# Discord Configuration
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# LucidLink Configuration
LUCIDLINK_BY_SHOT_PATH=/path/to/lucidlink/BY_SHOT

# Integration Settings
MAX_CONCURRENT_UPLOADS=3
ENABLE_DISCORD_NOTIFICATIONS=true
LOG_LEVEL=INFO
EOF
    log "✅ Fichier .env créé"
fi

# Étape 9: Créer les scripts utilitaires
log "🛠️ Création des scripts utilitaires..."

# Script de démarrage
cat > "$PROJECT_DIR/start.sh" << 'EOF'
#!/bin/bash
sudo systemctl start frameio-bridge.service
sudo systemctl status frameio-bridge.service
EOF

# Script d'arrêt
cat > "$PROJECT_DIR/stop.sh" << 'EOF'
#!/bin/bash
sudo systemctl stop frameio-bridge.service
sudo systemctl status frameio-bridge.service
EOF

# Script de redémarrage
cat > "$PROJECT_DIR/restart.sh" << 'EOF'
#!/bin/bash
sudo systemctl restart frameio-bridge.service
sudo systemctl status frameio-bridge.service
EOF

# Script de logs
cat > "$PROJECT_DIR/logs.sh" << 'EOF'
#!/bin/bash
sudo journalctl -u frameio-bridge.service -f
EOF

# Script de test
cat > "$PROJECT_DIR/test.sh" << 'EOF'
#!/bin/bash
cd /opt/rl_postflow
source venv/bin/activate
python examples/frameio_lucidlink_demo.py
EOF

chmod +x "$PROJECT_DIR"/*.sh

log "✅ Scripts utilitaires créés"

# Étape 10: Vérification finale
log "🔍 Vérification finale de l'installation..."

# Vérifier la structure
if [[ -d "$PROJECT_DIR/src" && -d "$PROJECT_DIR/config" && -d "$PROJECT_DIR/logs" ]]; then
    log "✅ Structure de dossiers OK"
else
    error "❌ Structure de dossiers incomplète"
    exit 1
fi

# Vérifier l'environnement virtuel
if [[ -f "$VENV_DIR/bin/python" ]]; then
    log "✅ Environnement virtuel OK"
else
    error "❌ Environnement virtuel manquant"
    exit 1
fi

# Vérifier le service systemd
if systemctl is-enabled frameio-bridge.service &>/dev/null; then
    log "✅ Service systemd OK"
else
    error "❌ Service systemd non configuré"
    exit 1
fi

# Afficher le résumé
log "🎉 Déploiement terminé avec succès!"
echo
echo "📋 RÉSUMÉ DE L'INSTALLATION"
echo "=========================="
echo "📁 Répertoire du projet: $PROJECT_DIR"
echo "👤 Utilisateur: $SERVICE_USER"
echo "🐍 Python: $PYTHON_VER"
echo "⚙️ Service: frameio-bridge.service"
echo
echo "📋 PROCHAINES ÉTAPES:"
echo "1. Configurez les variables d'environnement dans:"
echo "   - $PROJECT_DIR/.env"
echo "   - $PROJECT_DIR/config/frameio_integration.json"
echo
echo "2. Testez la configuration:"
echo "   cd $PROJECT_DIR && ./test.sh"
echo
echo "3. Démarrez le service:"
echo "   cd $PROJECT_DIR && ./start.sh"
echo
echo "4. Surveillez les logs:"
echo "   cd $PROJECT_DIR && ./logs.sh"
echo
echo "🔧 COMMANDES UTILES:"
echo "- Démarrer:    ./start.sh"
echo "- Arrêter:     ./stop.sh"
echo "- Redémarrer:  ./restart.sh"
echo "- Logs:        ./logs.sh"
echo "- Test:        ./test.sh"
echo
warn "⚠️  N'oubliez pas de configurer vos variables d'environnement avant de démarrer!"

log "✅ Installation terminée"
