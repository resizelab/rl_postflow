# Guide Configuration Google Sheets pour PostFlow

## 🚨 Problème Détecté

L'API Google Sheets n'est pas activée pour le projet `811286588718`.

## 🔧 Solution

### 1. Activer l'API Google Sheets

1. Allez sur : https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=811286588718
2. Cliquez sur **"ACTIVER"**
3. Attendez quelques minutes pour la propagation

### 2. Vérifier les Permissions du Service Account

1. Dans `config/google_credentials.json`, trouvez l'email du service account (champ `client_email`)
2. Ouvrez votre Google Spreadsheet : https://docs.google.com/spreadsheets/d/1cIJN9Ax4p5yjY0oa0LkafBTmj8LGXjup
3. Cliquez sur **"Partager"**
4. Ajoutez l'email du service account avec les permissions **"Éditeur"**

### 3. Vérifier la Structure des Worksheets

Assurez-vous que votre spreadsheet contient ces worksheets :
- **SHOTS_TRACK** : Pour le suivi des plans
- **USERS_INFOS** : Pour les informations des utilisateurs

#### Structure recommandée pour USERS_INFOS :
```
| Name          | Discord ID      | Email              | Role       | Department | Active |
|---------------|-----------------|--------------------|-----------|-----------|---------| 
| John Doe      | 123456789012345 | john@example.com   | Supervisor | VFX       | TRUE    |
| Jane Smith    | 987654321098765 | jane@example.com   | Artist     | VFX       | TRUE    |
```

#### Structure recommandée pour SHOTS_TRACK :
```
| Shot ID       | Scene         | Status        | Stage         | Assigned To | Frame.io Link |
|---------------|---------------|---------------|---------------|-----------|--------------| 
| UNDLM_00412   | DOUANE MER    | ae_completed  | after_effects | John Doe  |              |
| UNDLM_00413   | DOUANE MER    | pending       | source_verification | Jane Smith |              |
```

## 🧪 Test après Configuration

Une fois configuré, testez avec :

```bash
python scripts/test_google_sheets.py
```

## 📧 Email du Service Account

Pour trouver l'email du service account :

```bash
cat config/google_credentials.json | grep client_email
```

## ⚠️ Sécurité

- Ne commitez jamais le fichier `google_credentials.json` 
- Ajoutez-le au `.gitignore`
- Utilisez des permissions minimales (seulement les spreadsheets nécessaires)

## 🎯 Après Configuration

Une fois configuré, PostFlow pourra :
- ✅ Lire les informations des utilisateurs depuis USERS_INFOS
- ✅ Récupérer les Discord ID pour les mentions
- ✅ Mettre à jour les statuts des plans dans SHOTS_TRACK
- ✅ Ajouter les liens Frame.io automatiquement
