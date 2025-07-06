# Nettoyage du Repository PostFlow

## Fichiers supprimés pendant le nettoyage

### Fichiers temporaires et de cache
- `**/__pycache__/` - Cache Python
- `*.pyc`, `*.pyo`, `*.pyd` - Bytecode Python compilé
- `.DS_Store` - Fichiers système macOS
- `*.tmp`, `*.temp` - Fichiers temporaires
- `.pytest_cache/` - Cache des tests

### Fichiers de test
- `temp/UNDLM_00001_v999_test.mov` - Fichier vidéo de test
- Autres fichiers de test générés pendant les tests

### Dossiers nettoyés
- `logs/` - Vidé (logs temporaires)
- `backups/` - Vidé (sauvegardes temporaires)
- `temp/` - Fichiers de test supprimés
- `tmp/` - Conservé (clés SSL pour development)

## Fichiers ajoutés pour la publication

### Fichiers de configuration d'exemple
- `config/frameio_config.json.example` - Template de configuration Frame.io
- `config/integrations.json.example` - Template de configuration des intégrations

### Fichiers de gitignore
- `.gitignore` - Mis à jour avec règles complètes

## Fichiers de configuration sensibles

Les fichiers suivants contiennent des informations sensibles et ne doivent PAS être commités :

- `config/frameio_config.json` - Contient le token API Frame.io
- `config/integrations.json` - Contient les webhooks Discord
- `data/watcher_state.json` - État du watcher (peut contenir des chemins locaux)

## Structure finale du repository

```
postflow/
├── .github/           # GitHub Actions & templates
├── config/           # Configuration
│   ├── *.json.example # Templates de configuration
│   └── error_handling.json
├── data/             # Données du pipeline
│   ├── shots.csv     # Mapping des scènes
│   └── README.md
├── docs/             # Documentation complète
├── examples/         # Scripts d'exemple
├── scripts/          # Scripts utilitaires
├── src/              # Code source principal
├── tests/            # Tests unitaires et d'intégration
├── templates/        # Templates pour les rapports
├── main.py           # Point d'entrée principal
├── dashboard.py      # Dashboard web
└── requirements.txt  # Dépendances
```

## Instructions pour les utilisateurs

1. **Cloner le repository**
2. **Copier les fichiers de configuration** :
   ```bash
   cp config/frameio_config.json.example config/frameio_config.json
   cp config/integrations.json.example config/integrations.json
   ```
3. **Éditer les fichiers de configuration** avec vos credentials
4. **Installer les dépendances** : `pip install -r requirements.txt`
5. **Lancer les tests** : `python -m pytest`
6. **Démarrer le watcher** : `python scripts/start_watcher.py`

## Sécurité

- ✅ Aucun credential ou token n'est committé
- ✅ Tous les fichiers sensibles sont dans .gitignore
- ✅ Des templates de configuration sont fournis
- ✅ Les logs et fichiers temporaires sont exclus

Repository prêt pour publication publique ! 🚀
