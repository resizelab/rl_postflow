# Configuration PostFlow

Ce guide vous aide à configurer PostFlow pour votre environnement.

## 🚀 Configuration rapide

### 1. Installation des dépendances
```bash
pip install -r requirements.txt
```

### 2. Configuration des intégrations
```bash
python scripts/setup_integrations.py
```

### 3. Test de la configuration
```bash
python scripts/setup_integrations.py test
```

### 4. Lancement
```bash
# Dashboard web
python dashboard.py

# File watcher
python main.py
```

## 🔧 Configuration détaillée

### Frame.io
1. Créer un compte sur [Frame.io](https://frame.io)
2. Générer un token API dans les paramètres développeur
3. Créer un projet et noter l'ID
4. Configurer via le script ou manuellement dans `config/integrations.json`

### Discord
1. Créer un serveur Discord ou utiliser un existant
2. Créer un webhook dans les paramètres du canal
3. Copier l'URL du webhook
4. Configurer via le script ou manuellement

### Google Sheets
1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activer l'API Google Sheets
3. Créer un compte de service et télécharger le JSON
4. Placer le fichier dans `config/google_credentials.json`
5. Partager votre feuille avec l'email du compte de service

### After Effects
1. Créer vos templates AE dans `templates/ae/`
2. Configurer le chemin dans la configuration
3. S'assurer qu'After Effects est installé si vous utilisez l'automation

### EbSynth
1. Télécharger et installer [EbSynth](https://ebsynth.com)
2. Noter le chemin d'installation
3. Configurer via le script

## 📁 Structure des fichiers

```
config/
├── error_handling.json      # Configuration principale
├── integrations.json        # Configuration des intégrations
└── google_credentials.json  # Credentials Google (à créer)

templates/
└── ae/                      # Templates After Effects
    ├── README.md
    └── *.aep               # Vos templates

data/
├── shots.csv               # Données des plans
├── timeline                # Timeline du projet
└── postflow.db            # Base de données
```

## 🧪 Tests

### Test des intégrations
```bash
python -m pytest tests/unit/test_integrations.py -v
```

### Test du dashboard
```bash
python tests/integration/test_dashboard.py
```

### Test complet
```bash
python -m pytest tests/ -v
```

## 🛠️ Troubleshooting

### Problèmes courants

**"Module not found"**
```bash
pip install -r requirements.txt
```

**"Configuration file not found"**
```bash
python scripts/setup_integrations.py
```

**"Permission denied"**
- Vérifier les permissions des dossiers
- S'assurer que les chemins sont corrects

**"API Token invalid"**
- Régénérer les tokens d'API
- Vérifier les permissions

### Logs
- Dashboard: Logs affichés dans la console
- File watcher: Logs dans `data/postflow.log`
- Erreurs: Consultez le dashboard web pour les détails

## 📞 Support

1. Vérifier la documentation dans `/docs/`
2. Consulter les logs d'erreur
3. Tester les configurations une par une
4. Consulter les exemples dans `/examples/`

## 🔒 Sécurité

⚠️ **Important** :
- Ne jamais commiter les tokens d'API
- Utiliser des variables d'environnement en production
- Restreindre les permissions des comptes de service
- Utiliser HTTPS en production
