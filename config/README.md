# 📁 Configuration Files

Ce dossier contient les fichiers de configuration pour RL PostFlow v4.1.1.

## 🔧 **Fichiers de Configuration**

### **Fichiers d'Exemple (à copier et modifier)**

Ces fichiers sont fournis comme modèles et doivent être copiés et configurés avec vos propres valeurs :

| Fichier | Description | Action Requise |
|---------|-------------|----------------|
| `integrations.json.example` | Configuration principale des intégrations | Copier vers `integrations.json` et configurer |
| `google_credentials.json.example` | Credentials Google Service Account | Copier vers `google_credentials.json` et configurer |
| `pipeline_config.json.example` | Configuration du pipeline | Copier vers `pipeline_config.json` et configurer |
| `error_handling.json.example` | Configuration de gestion d'erreurs | Copier vers `error_handling.json` et configurer |
| `nomenclature.json.example` | Configuration de la nomenclature | Copier vers `nomenclature.json` et configurer |
| `sheets_mapping.json.example` | Mapping Google Sheets | Copier vers `sheets_mapping.json` et configurer |

### **Fichiers Générés Automatiquement**

Ces fichiers sont créés et mis à jour automatiquement par le système :

- `frameio_structure.json` - Cache de la structure Frame.io
- `frameio_structure_cache.json` - Cache des dossiers Frame.io
- `frameio_config.json` - Configuration Frame.io générée
- `alerts.json` - Configuration des alertes
- `optimization.json` - Paramètres d'optimisation

## 🚀 **Configuration Rapide**

### 1. **Copier les fichiers d'exemple**

```bash
cd config/
cp integrations.json.example integrations.json
cp google_credentials.json.example google_credentials.json
cp pipeline_config.json.example pipeline_config.json
cp error_handling.json.example error_handling.json
cp nomenclature.json.example nomenclature.json
cp sheets_mapping.json.example sheets_mapping.json
```

### 2. **Configurer les intégrations principales**

#### **Frame.io (Obligatoire)**
Éditez `integrations.json` :
```json
{
  "frameio": {
    "client_id": "VOTRE_ADOBE_CLIENT_ID",
    "client_secret": "VOTRE_ADOBE_CLIENT_SECRET",
    "project_id": "VOTRE_FRAMEIO_PROJECT_ID",
    "account_id": "VOTRE_FRAMEIO_ACCOUNT_ID",
    "workspace_id": "VOTRE_FRAMEIO_WORKSPACE_ID"
  }
}
```

#### **LucidLink (Obligatoire)**
Éditez `integrations.json` :
```json
{
  "lucidlink": {
    "base_path": "/path/to/your/lucidlink/mount",
    "watch_directory": "/path/to/your/lucidlink/watch"
  }
}
```

#### **Google Drive & Sheets (Optionnel)**
1. Créez un Service Account Google
2. Téléchargez le fichier JSON des credentials
3. Remplacez le contenu de `google_credentials.json`
4. Configurez les IDs dans `integrations.json`

#### **Discord (Optionnel)**
Éditez `integrations.json` :
```json
{
  "discord": {
    "webhook_url": "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"
  }
}
```

## 🔐 **Sécurité**

### **Fichiers à Protéger**
Ces fichiers contiennent des secrets et ne doivent **JAMAIS** être commitées :
- `integrations.json`
- `google_credentials.json`
- `production_config.json`
- `private.key`

### **Bonnes Pratiques**
1. ✅ Utilisez des variables d'environnement pour les secrets en production
2. ✅ Gardez des backups sécurisés de vos fichiers de configuration
3. ✅ Rotez régulièrement vos tokens et credentials
4. ❌ Ne partagez jamais vos fichiers de configuration réels
5. ❌ N'incluez jamais de secrets dans les commits Git

## 📋 **Validation**

Pour vérifier votre configuration :

```bash
# Test des composants
python main.py --test

# Test avec un fichier spécifique
python main.py --file /path/to/test/file.mov --debug
```

## 🆘 **Support**

- 📖 [Documentation complète](../docs/)
- 🐛 [Signaler un problème](https://github.com/resizelab/rl_postflow/issues)
- 💬 [Discussions](https://github.com/resizelab/rl_postflow/discussions)
