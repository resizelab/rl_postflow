#!/usr/bin/env python3
"""
Script pour générer les clés privées nécessaires à l'authentification JWT Server-to-Server

[ARCHIVÉ] Ce script est obsolète : l'intégration Frame.io utilise uniquement OAuth Web App v4.
Voir scripts/frameio_oauth_webapp_demo.py
"""

import os
import sys
from pathlib import Path
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

def generate_private_key(key_size=2048):
    """Génère une clé privée RSA"""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=key_size,
        backend=default_backend()
    )
    return private_key

def save_private_key(private_key, file_path, passphrase=None):
    """Sauvegarde la clé privée dans un fichier"""
    encryption_algorithm = serialization.NoEncryption()
    if passphrase:
        encryption_algorithm = serialization.BestAvailableEncryption(passphrase.encode())
    
    pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=encryption_algorithm
    )
    
    with open(file_path, 'wb') as f:
        f.write(pem)

def save_public_key(private_key, file_path):
    """Sauvegarde la clé publique correspondante"""
    public_key = private_key.public_key()
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    with open(file_path, 'wb') as f:
        f.write(pem)

def main():
    """Fonction principale"""
    print("🔑 Génération des clés privées pour Adobe IMS Server-to-Server")
    print("=" * 65)
    
    # Créer le dossier config s'il n'existe pas
    config_dir = Path("config")
    config_dir.mkdir(exist_ok=True)
    
    # Chemins des fichiers
    private_key_path = config_dir / "private.key"
    public_key_path = config_dir / "public.key"
    
    # Vérifier si les clés existent déjà
    if private_key_path.exists():
        response = input(f"⚠️  La clé privée existe déjà : {private_key_path}\n"
                        "Voulez-vous la remplacer ? (y/N): ")
        if response.lower() != 'y':
            print("🚫 Génération annulée")
            return
    
    try:
        # Générer la clé privée
        print("🔄 Génération de la clé privée RSA 2048 bits...")
        private_key = generate_private_key()
        
        # Demander une passphrase (optionnel)
        passphrase = input("🔐 Entrez une passphrase pour sécuriser la clé privée (optionnel): ")
        if not passphrase.strip():
            passphrase = None
        
        # Sauvegarder la clé privée
        print(f"💾 Sauvegarde de la clé privée dans {private_key_path}")
        save_private_key(private_key, private_key_path, passphrase)
        
        # Sauvegarder la clé publique
        print(f"💾 Sauvegarde de la clé publique dans {public_key_path}")
        save_public_key(private_key, public_key_path)
        
        # Définir les permissions appropriées
        os.chmod(private_key_path, 0o600)  # Lecture seule pour le propriétaire
        os.chmod(public_key_path, 0o644)   # Lecture pour tous
        
        print("\n✅ Clés générées avec succès !")
        print(f"   Clé privée : {private_key_path}")
        print(f"   Clé publique : {public_key_path}")
        
        # Instructions pour Adobe Developer Console
        print("\n📋 Prochaines étapes :")
        print("1. Copiez le contenu de public.key")
        print("2. Dans Adobe Developer Console, collez cette clé publique")
        print("3. Récupérez le Technical Account ID généré")
        print("4. Mettez à jour FRAMEIO_TECHNICAL_ACCOUNT_ID dans .env")
        
        # Afficher la clé publique
        print("\n📄 Contenu de la clé publique à copier :")
        print("-" * 50)
        with open(public_key_path, 'r') as f:
            print(f.read())
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ Erreur lors de la génération des clés : {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
