# Tests Legacy

Ces fichiers sont les anciens tests avant la restructuration avec pytest.

## Fichiers legacy
- `test_error_handling.py` - Tests originaux du gestionnaire d'erreurs
- `test_simple.py` - Tests simples de debug
- `test_debug.py` - Tests de debug avancés
- `test_integrations_simple.py` - Tests d'intégrations originaux

## Migration
Ces tests ont été migrés vers la nouvelle structure pytest :
- `tests/unit/` - Tests unitaires
- `tests/integration/` - Tests d'intégration

Les nouveaux tests utilisent pytest avec fixtures et mocks appropriés.
