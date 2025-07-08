#!/usr/bin/env python3
"""
Script pour vérifier et corriger les permissions des images dans Google Drive
S'assure que toutes les vignettes sont accessibles publiquement
"""

import json
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

class DrivePermissionsManager:
    def __init__(self):
        """Initialise le gestionnaire de permissions."""
        self.setup_drive_service()
        self.find_thumbnails_folder()
    
    def setup_drive_service(self):
        """Configure le service Google Drive."""
        scope = ['https://www.googleapis.com/auth/drive']
        creds = Credentials.from_service_account_file('config/google_credentials.json', scopes=scope)
        self.drive_service = build('drive', 'v3', credentials=creds)
        print("✅ Service Google Drive connecté")
    
    def find_thumbnails_folder(self):
        """Trouve le dossier PostFlow_Thumbnails."""
        # Chercher le dossier principal
        query = "name='PostFlow_Thumbnails' and mimeType='application/vnd.google-apps.folder'"
        results = self.drive_service.files().list(q=query).execute()
        folders = results.get('files', [])
        
        if not folders:
            print("❌ Dossier PostFlow_Thumbnails non trouvé")
            return None
        
        self.main_folder_id = folders[0]['id']
        print(f"📁 Dossier principal trouvé: {self.main_folder_id}")
        
        # Chercher le sous-dossier UNDLM_Project
        query = f"name='UNDLM_Project' and '{self.main_folder_id}' in parents and mimeType='application/vnd.google-apps.folder'"
        results = self.drive_service.files().list(q=query).execute()
        folders = results.get('files', [])
        
        if folders:
            project_folder_id = folders[0]['id']
            print(f"📁 Dossier projet trouvé: {project_folder_id}")
            
            # Chercher le dossier du mois
            query = f"'{project_folder_id}' in parents and mimeType='application/vnd.google-apps.folder'"
            results = self.drive_service.files().list(q=query).execute()
            month_folders = results.get('files', [])
            
            if month_folders:
                self.thumbnails_folder_id = month_folders[0]['id']
                print(f"📁 Dossier thumbnails trouvé: {self.thumbnails_folder_id}")
                return True
        
        return False
    
    def list_thumbnail_files(self):
        """Liste tous les fichiers image dans le dossier thumbnails."""
        if not hasattr(self, 'thumbnails_folder_id'):
            print("❌ Dossier thumbnails non trouvé")
            return []
        
        query = f"'{self.thumbnails_folder_id}' in parents and mimeType contains 'image/'"
        results = self.drive_service.files().list(
            q=query,
            fields='files(id, name, webViewLink, permissions)'
        ).execute()
        
        files = results.get('files', [])
        print(f"🖼️  {len(files)} images trouvées dans le dossier")
        
        return files
    
    def check_file_permissions(self, file_id):
        """Vérifie les permissions d'un fichier."""
        try:
            permissions = self.drive_service.permissions().list(fileId=file_id).execute()
            perms = permissions.get('permissions', [])
            
            # Chercher la permission publique
            public_permission = None
            for perm in perms:
                if perm.get('type') == 'anyone' and perm.get('role') == 'reader':
                    public_permission = perm
                    break
            
            return public_permission is not None, perms
            
        except Exception as e:
            print(f"❌ Erreur vérification permissions: {e}")
            return False, []
    
    def make_file_public(self, file_id, file_name):
        """Rend un fichier public."""
        try:
            permission = {
                'type': 'anyone',
                'role': 'reader'
            }
            self.drive_service.permissions().create(
                fileId=file_id,
                body=permission
            ).execute()
            
            print(f"✅ {file_name} rendu public")
            return True
            
        except Exception as e:
            print(f"❌ Erreur permission pour {file_name}: {e}")
            return False
    
    def get_public_url(self, file_id):
        """Génère l'URL publique pour affichage dans Google Sheets."""
        return f"https://drive.google.com/uc?export=view&id={file_id}"
    
    def check_and_fix_all_permissions(self):
        """Vérifie et corrige les permissions de toutes les images."""
        print("🔍 VÉRIFICATION DES PERMISSIONS")
        print("=" * 40)
        
        files = self.list_thumbnail_files()
        
        if not files:
            print("Aucune image à vérifier")
            return
        
        fixed_count = 0
        already_public = 0
        error_count = 0
        
        for file in files:
            file_id = file['id']
            file_name = file['name']
            
            print(f"\n📋 {file_name}")
            
            # Vérifier les permissions actuelles
            is_public, permissions = self.check_file_permissions(file_id)
            
            if is_public:
                print(f"   ✅ Déjà public")
                already_public += 1
                
                # Afficher l'URL
                public_url = self.get_public_url(file_id)
                print(f"   🔗 URL: {public_url}")
            else:
                print(f"   ⚠️  Pas public - correction en cours...")
                
                if self.make_file_public(file_id, file_name):
                    public_url = self.get_public_url(file_id)
                    print(f"   🔗 Nouvelle URL: {public_url}")
                    fixed_count += 1
                else:
                    error_count += 1
        
        print(f"\n🎉 RÉSUMÉ:")
        print(f"   Images vérifiées: {len(files)}")
        print(f"   Déjà publiques: {already_public}")
        print(f"   Corrigées: {fixed_count}")
        print(f"   Erreurs: {error_count}")
        
        if fixed_count > 0:
            print(f"\n✅ {fixed_count} images sont maintenant publiques")
            print("Les images devraient maintenant s'afficher dans Google Sheets")
    
    def test_image_access(self, file_id):
        """Teste l'accès à une image via son URL publique."""
        import requests
        
        public_url = self.get_public_url(file_id)
        
        try:
            response = requests.head(public_url, timeout=10)
            if response.status_code == 200:
                print(f"✅ Image accessible: {public_url}")
                return True
            else:
                print(f"❌ Image non accessible (code {response.status_code}): {public_url}")
                return False
        except Exception as e:
            print(f"❌ Erreur test accès: {e}")
            return False

def main():
    """Fonction principale."""
    manager = DrivePermissionsManager()
    
    if hasattr(manager, 'thumbnails_folder_id'):
        manager.check_and_fix_all_permissions()
        
        # Test d'accès sur le premier fichier
        files = manager.list_thumbnail_files()
        if files:
            print(f"\n🧪 Test d'accès sur {files[0]['name']}...")
            manager.test_image_access(files[0]['id'])
    else:
        print("❌ Impossible de trouver le dossier des vignettes")

if __name__ == "__main__":
    main()
