# 🚀 Guide d'Administration Frame.io - Outils Avancés

## 📋 Vue d'ensemble

Cette documentation présente les outils avancés d'administration et d'optimisation pour l'intégration Frame.io du pipeline RL PostFlow.

## 🛠️ Outils Disponibles

### 1. CLI d'Administration (`frameio_admin_cli.py`)

Interface en ligne de commande complète pour l'administration Frame.io.

#### Installation et Configuration

```bash
# Installer les dépendances (si nécessaire)
pip install psutil

# Rendre le script exécutable
chmod +x scripts/frameio_admin_cli.py
```

#### Commandes Principales

```bash
# Validation complète du système
python scripts/frameio_admin_cli.py health

# Statistiques du cache
python scripts/frameio_admin_cli.py cache stats

# Vider le cache complètement
python scripts/frameio_admin_cli.py cache clear

# Vider sélectivement (ex: tous les dossiers)
python scripts/frameio_admin_cli.py cache clear --pattern folder_

# Valider la configuration
python scripts/frameio_admin_cli.py validate

# Informations sur la structure
python scripts/frameio_admin_cli.py structure
python scripts/frameio_admin_cli.py structure --project-id 123456

# Tester un upload
python scripts/frameio_admin_cli.py test-upload test.mp4 "SC01" "S01"

# Tester la nomenclature
python scripts/frameio_admin_cli.py nomenclature "UNDLM_SEQ01_00042_v002.mp4"
```

### 2. Optimiseur de Performance (`frameio_optimization.py`)

Outil de monitoring et d'optimisation des performances.

#### Utilisation

```bash
# Lancer l'optimisation
python scripts/frameio_optimization.py

# Le rapport est automatiquement sauvegardé dans logs/
```

#### Métriques Surveillées

- **API Calls**: Durée, taux de succès, latence
- **Uploads**: Vitesse, taille, temps de transfert
- **Cache**: Taux de hit/miss, performance
- **Système**: Utilisation CPU/mémoire
- **Erreurs**: Fréquence, types d'erreurs

## 🎯 Fonctionnalités Avancées

### Cache Intelligent

Le nouveau système de cache offre :

- **TTL configurable** par type de données
- **Invalidation automatique** sur erreur
- **Nettoyage périodique** des entrées expirées
- **Statistiques détaillées** d'utilisation

#### Configuration du Cache

Fichier `config/optimization.json` :

```json
{
  "cache_ttl": {
    "projects": 1800,    // 30 minutes
    "folders": 900,      // 15 minutes
    "structure": 3600    // 1 heure
  },
  "cache_invalidation": {
    "auto_invalidate_on_error": true,
    "max_cache_age_hours": 24,
    "cleanup_interval_hours": 6
  }
}
```

### Gestion d'Erreurs Améliorée

#### Retry Automatique

- **Back-off exponentiel** pour éviter la surcharge
- **Rate limiting** respecté automatiquement
- **Circuit breaker** pour les services défaillants

#### Logging Détaillé

```python
# Exemple de log structuré
2025-01-07 14:30:15 - frameio.structure - INFO - Cache hit: projects_123456
2025-01-07 14:30:16 - frameio.api - WARNING - Rate limit atteint, attente 2s
2025-01-07 14:30:18 - frameio.upload - ERROR - Upload échoué: 422 - Payload invalide
```

### Monitoring en Temps Réel

#### Métriques Système

- **Utilisation mémoire** du processus
- **Charge CPU** pendant les opérations
- **Latence réseau** vers Frame.io
- **Débit upload** en MB/s

#### Alertes Automatiques

Le système génère des alertes quand :
- Le taux d'erreur dépasse 5%
- La latence moyenne > 5 secondes
- L'utilisation mémoire > 500 MB
- Le taux de cache miss > 30%

## 📊 Rapports d'Optimisation

### Rapport Type

```
🔍 RAPPORT D'OPTIMISATION FRAME.IO
==================================================

📊 Session: 1247.3s

🌐 API CALLS:
   Total: 42
   Taux de succès: 97.62%
   Durée moyenne: 1.23s
   Durée médiane: 0.87s

📤 UPLOADS:
   Total: 8
   Vitesse moyenne: 3.45 MB/s
   Vitesse médiane: 3.12 MB/s

💾 CACHE:
   Taux de hit: 78.35%
   Hits: 156
   Misses: 43

🖥️  SYSTÈME:
   Mémoire moyenne: 127.3 MB
   Mémoire pic: 245.8 MB
   CPU moyen: 12.4%
   CPU pic: 34.2%

❌ ERREURS:
   Total: 1
   Taux: 2.38%

💡 RECOMMANDATIONS:
   • Performances optimales! 🎉
```

### Utilisation des Rapports

- **Identification des goulots d'étranglement**
- **Optimisation des paramètres de cache**
- **Planification de la capacité**
- **Surveillance de la dégradation**

## 🔧 Maintenance et Dépannage

### Nettoyage Périodique

```bash
# Nettoyage automatique du cache
python scripts/frameio_admin_cli.py cache clear --pattern expired

# Vérification complète
python scripts/frameio_admin_cli.py health
```

### Diagnostic des Problèmes

#### Problèmes Courants

1. **Cache trop volumineux**
   ```bash
   # Solution: Réduire les TTL ou nettoyer
   python scripts/frameio_admin_cli.py cache clear
   ```

2. **Taux d'erreur élevé**
   ```bash
   # Solution: Vérifier la configuration
   python scripts/frameio_admin_cli.py validate
   ```

3. **Performances dégradées**
   ```bash
   # Solution: Analyser les métriques
   python scripts/frameio_optimization.py
   ```

### Logs de Débogage

#### Activation

```bash
# Variable d'environnement
export FRAMEIO_DEBUG=1

# Ou dans le code
logging.getLogger('frameio').setLevel(logging.DEBUG)
```

#### Fichiers de Log

- `logs/frameio_optimization_report_YYYYMMDD_HHMMSS.txt`
- `logs/frameio_admin.log`
- `logs/frameio_errors.log`

## 📈 Bonnes Pratiques

### Utilisation du Cache

1. **Configurez les TTL** selon vos besoins
2. **Surveillez le taux de hit** (objectif: >70%)
3. **Nettoyez périodiquement** les entrées expirées
4. **Invalidez après modification** de structure

### Optimisation des Uploads

1. **Utilisez ngrok** pour les uploads publics
2. **Configurez les chunks** selon votre bande passante
3. **Limitez les uploads simultanés** (3 max recommandé)
4. **Surveillez les timeouts** (300s par défaut)

### Monitoring Continu

1. **Exécutez des health checks** réguliers
2. **Surveillez les métriques** de performance
3. **Analysez les rapports** d'optimisation
4. **Ajustez la configuration** selon les résultats

## 🚨 Alertes et Notifications

### Configuration des Seuils

```json
{
  "alerts": {
    "error_rate_threshold": 0.05,
    "latency_threshold": 5.0,
    "memory_threshold": 500,
    "cache_miss_threshold": 0.3
  }
}
```

### Intégration Discord

Les alertes peuvent être envoyées automatiquement via Discord :

```python
# Exemple d'alerte
"⚠️ ALERTE PERFORMANCE
Taux d'erreur: 8.3% (seuil: 5%)
Latence moyenne: 7.2s (seuil: 5s)
Action recommandée: Vérifier la connexion Frame.io"
```

## 📚 Ressources Supplémentaires

### Documentation Technique

- [Frame.io API v4 Documentation](https://docs.frame.io/v4/)
- [Guide d'authentification Adobe IMS](docs/ADOBE_IMS_SETUP.md)
- [Configuration du pipeline](docs/CONFIGURATION.md)

### Outils de Diagnostic

- **Frame.io Status Page**: https://status.frame.io
- **Adobe IMS Status**: https://status.adobe.com
- **Ngrok Dashboard**: https://dashboard.ngrok.com

### Support

En cas de problème persistant :

1. Exécutez `python scripts/frameio_admin_cli.py health`
2. Consultez les logs dans `logs/`
3. Générez un rapport avec `python scripts/frameio_optimization.py`
4. Contactez le support avec ces informations

---

**Dernière mise à jour**: 7 janvier 2025
**Version**: 1.0
**Compatibilité**: Frame.io API v4, Python 3.8+
