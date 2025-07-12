# 🪟 RL PostFlow - Guide Windows

Guide d'installation et configuration spécifique pour Windows

## 🔧 Installation Windows

### Prérequis Windows

1. **Python 3.8+** 
   - Télécharger depuis [python.org](https://python.org)
   - Cocher "Add Python to PATH" lors de l'installation

2. **Git for Windows**
   - Télécharger depuis [git-scm.com](https://git-scm.com)

3. **LucidLink**
   - Installer le client LucidLink pour Windows
   - Configurer le montage sur `E:\Volumes\resizelab\o2b-undllm`

4. **FFmpeg** (pour les thumbnails)
   ```cmd
   # Via Chocolatey (recommandé)
   choco install ffmpeg
   
   # Ou télécharger depuis https://ffmpeg.org/download.html
   # et ajouter au PATH Windows
   ```

### Installation Automatique

```cmd
# Cloner le repository
git clone https://github.com/your-org/rl-postflow.git
cd rl-postflow

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'installation interactive
python setup_postflow.py
```

L'installateur détectera automatiquement Windows et configurera les chemins appropriés.

### Installation Manuelle

1. **Cloner le projet**
   ```cmd
   git clone https://github.com/your-org/rl-postflow.git
   cd rl-postflow
   ```

2. **Installer les dépendances**
   ```cmd
   pip install -r requirements.txt
   ```

3. **Configurer les chemins Windows**
   
   Éditer `config/integrations.json` :
   ```json
   {
     "lucidlink": {
       "base_path": "E:\\Volumes\\resizelab\\o2b-undllm",
       "watch_directory": "E:\\Volumes\\resizelab\\o2b-undllm"
     }
   }
   ```

## 🔄 Migration depuis macOS

Si vous migrez une installation existante depuis macOS :

```cmd
# Utiliser le script de migration
python migrate_to_windows.py
```

Ce script :
- Sauvegarde les configurations existantes
- Convertit automatiquement les chemins macOS → Windows
- Valide la nouvelle configuration

## 🚀 Utilisation

### Démarrage du Pipeline

```cmd
# Démarrer PostFlow
python main.py

# Avec options
python main.py --debug
python main.py --no-dashboard
```

### Traitement d'un fichier spécifique

```cmd
# Traiter un fichier spécifique
python main.py --file "E:\Volumes\resizelab\o2b-undllm\SQ01\UNDLM_00001\SQ01_UNDLM_00001_v001.mov"

# Forcer le re-traitement
python main.py --file "chemin\vers\fichier.mov" --force
```

### Dashboard Web

Le dashboard est accessible sur `http://localhost:8080` après démarrage.

### Arrêt du Pipeline

```cmd
# Arrêt propre
python stop_postflow.py

# Ou Ctrl+C dans le terminal
```

## 📁 Structure des Chemins Windows

PostFlow utilise la structure suivante sur Windows :

```
E:\Volumes\resizelab\o2b-undllm\
├── 2_IN\
│   └── _FROM_GRADING\
│       └── UNDLM_SOURCES\
├── 3_PROJECTS\
│   └── 2_VFX\
│       ├── SEQUENCES\
│       ├── _TEMPLATES\
│       └── MASTER\
├── 4_OUT\
│   └── 2_FROM_VFX\
└── 5_DELIVERABLES\
    └── MASTER\
```

## 🛠️ Configuration Spécifique Windows

### Variables d'Environnement

Créer un fichier `.env` dans le répertoire du projet :

```env
# Chemins Windows
LUCIDLINK_MOUNT_PATH=E:\Volumes\resizelab\o2b-undllm
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe

# Frame.io OAuth
FRAMEIO_CLIENT_ID=your_client_id
FRAMEIO_CLIENT_SECRET=your_client_secret

# Discord
DISCORD_WEBHOOK_URL=your_webhook_url
```

### Configuration Frame.io

Dans `config/integrations.json` :

```json
{
  "frameio": {
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "redirect_uri": "http://localhost:8080/callback",
    "enabled": true
  }
}
```

### Permissions Windows

Assurer que le processus Python a les permissions pour :
- Lire/écrire dans le répertoire LucidLink
- Créer des fichiers de log dans `logs/`
- Accéder au réseau pour les APIs

## 🧪 Tests et Validation

### Test de Compatibilité

```cmd
# Tester la compatibilité Windows
python test_cross_platform.py
```

### Test des Composants

```cmd
# Tester uniquement les composants
python main.py --test
```

### Validation d'un fichier

```cmd
# Valider la nomenclature d'un fichier
python -c "from src.integrations.frameio.upload import validate_strict_nomenclature; print(validate_strict_nomenclature(r'E:\Volumes\resizelab\o2b-undllm\SQ01\UNDLM_00001\SQ01_UNDLM_00001_v001.mov'))"
```

## 🐛 Dépannage Windows

### Problèmes Courants

1. **LucidLink non détecté**
   ```cmd
   # Vérifier le service LucidLink
   tasklist | findstr lucid
   
   # Vérifier le point de montage
   dir E:\Volumes\resizelab\o2b-undllm
   ```

2. **Erreurs de permissions**
   - Exécuter PowerShell/CMD en tant qu'administrateur
   - Vérifier les permissions sur le dossier LucidLink

3. **Erreurs de chemins**
   ```cmd
   # Tester la normalisation des chemins
   python -c "from src.utils.cross_platform_paths import normalize_lucidlink_path; print(normalize_lucidlink_path(r'E:\Volumes\resizelab\o2b-undllm\test.mov'))"
   ```

4. **Problèmes de réseau**
   - Vérifier le pare-feu Windows
   - Autoriser Python et PostFlow dans les exceptions

### Logs de Débogage

```cmd
# Lancer en mode debug
python main.py --debug

# Consulter les logs
type logs\postflow.log
```

### Réinitialisation

```cmd
# Sauvegarder et réinitialiser la configuration
python migrate_to_windows.py --restore

# Ou supprimer et recréer
del config\integrations.json
python setup_postflow.py
```

## 📞 Support Windows

Pour les problèmes spécifiques Windows :

1. Vérifier les [Issues GitHub](https://github.com/your-org/rl-postflow/issues)
2. Exécuter `python test_cross_platform.py` et partager les résultats
3. Inclure les informations système :
   ```cmd
   python -c "import platform; print(f'OS: {platform.system()} {platform.release()}'); print(f'Python: {platform.python_version()}'); print(f'Architecture: {platform.machine()}')"
   ```

## 🔄 Mises à Jour

```cmd
# Mettre à jour PostFlow
git pull origin main
pip install -r requirements.txt

# Re-tester après mise à jour
python test_cross_platform.py
```

---

**RL PostFlow v4.1.1** - Compatible Windows 🪟
