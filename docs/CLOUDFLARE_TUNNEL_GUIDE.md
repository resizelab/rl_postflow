# Guide d'utilisation de Cloudflare Tunnel pour RL PostFlow

## 📋 Vue d'ensemble

Cloudflare Tunnel est la solution recommandée pour exposer le serveur HTTP local lors de l'upload de fichiers LucidLink vers Frame.io. Il remplace ngrok et Serveo en offrant une solution robuste et sans limite de bande passante.

**✅ TESTÉ ET VALIDÉ** : Upload réussi d'un fichier .mov de 831MB via Cloudflare Tunnel

## ✅ Avantages de Cloudflare Tunnel

- **Pas de limite de bande passante** (ngrok gratuit limité à 1GB)
- **Connexion HTTPS stable** et sécurisée
- **Pas de timeout** (ngrok gratuit limité à 8h)
- **Tunnel robuste** qui reste actif pendant des heures
- **Gratuit** pour un usage personnel/développement
- **Surveillance temps réel** du téléchargement Frame.io

## Installation

1. Installer cloudflared :
```bash
# macOS (via Homebrew)
brew install cloudflared

# Linux
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

2. Vérifier l'installation :
```bash
cloudflared --version
```

## Configuration

Le gestionnaire Cloudflare est déjà intégré dans le pipeline :
- Classe `CloudflareManager` dans `src/integrations/frameio/cloudflare_manager.py`
- Démarrage automatique du tunnel
- Gestion des erreurs et cleanup

## Utilisation

### Test autonome

```bash
# Test avec un fichier LucidLink
python test_cloudflare.py "/path/to/file.mov"
```

### Intégration dans le pipeline

Le tunnel Cloudflare est maintenant intégré dans le pipeline principal :

```python
from src.integrations.frameio.cloudflare_manager import CloudflareManager

# Démarrer le tunnel
cf_manager = CloudflareManager()
tunnel_url = cf_manager.start_tunnel(port, timeout=60)

# Utiliser l'URL publique pour Frame.io
public_url = f"{tunnel_url}/{file_name}"
```

## Monitoring

Le système surveille automatiquement :
- ✅ Statut du tunnel Cloudflare
- ✅ Requêtes HTTP de Frame.io
- ✅ Progression du téléchargement
- ✅ Détection de fin de téléchargement

## Logs

Les logs indiquent :
- Démarrage du tunnel : `✅ Tunnel Cloudflare actif: https://xxx.trycloudflare.com`
- Requêtes HTTP : `📊 Requête HTTP: GET /file.mov`
- Progression : `📊 Frame.io: 123,456 bytes (15.2%)`
- Fin : `✅ Téléchargement Frame.io terminé !`

## Troubleshooting

### Tunnel ne démarre pas
- Vérifier que `cloudflared` est installé
- Vérifier que le port local est libre
- Augmenter le timeout si nécessaire

### DNS resolution failed
- Normal au début, Cloudflare propage le DNS
- Frame.io peut accéder même si curl local échoue

### Tunnel se ferme prématurément
- Vérifier les logs du processus cloudflared
- Redémarrer le tunnel si nécessaire

## Sécurité

- Le tunnel est temporaire et se ferme automatiquement
- URLs uniques générées pour chaque upload
- Pas de données sensibles exposées
- Accès HTTPS sécurisé

## Performance

- Pas de limite de bande passante
- Optimisé pour les gros fichiers (>1GB)
- Support des requêtes Range HTTP
- Streaming efficace des fichiers LucidLink

## Comparaison avec les alternatives

| Solution | Bande passante | Timeout | Stabilité | Coût |
|----------|---------------|---------|-----------|------|
| Cloudflare Tunnel | ✅ Illimitée | ✅ Aucun | ✅ Excellente | ✅ Gratuit |
| ngrok (gratuit) | ❌ 1GB/mois | ❌ 8h | ⚠️ Moyenne | ✅ Gratuit |
| Serveo | ⚠️ Variable | ⚠️ Variable | ❌ Instable | ✅ Gratuit |

## Intégration production

Pour un usage en production, configurer :
1. Domaine personnalisé Cloudflare
2. Authentification si nécessaire
3. Logs persistants
4. Monitoring avancé

```python
# Configuration avancée
cf_manager = CloudflareManager(
    custom_domain="tunnel.mondomaine.com",
    auth_required=True,
    log_level="DEBUG"
)
```
