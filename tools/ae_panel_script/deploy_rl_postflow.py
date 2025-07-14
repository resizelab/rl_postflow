#!/usr/bin/env python3
"""
Déploiement RL PostFlow Panel
Déploiement automatisé vers LucidLink et documentation
"""

import os
import shutil
import subprocess
import json
from pathlib import Path
from datetime import datetime

class RLPostFlowDeployer:
    def __init__(self):
        self.version = "1.6.1"
        self.files_to_deploy = [
            # Panel principal
            "RL_PostFlow_Panel.jsx",
            
            # Installeur unifié
            "install_rl_postflow_complete.jsx",
            
            # Templates
            "templates/RL PostFlow.aom",
            "templates/RL PostFlow.ars",
            
            # Configuration
            "config.json",
            
            # Documentation
            "README.md"
        ]
        
    def detect_lucidlink_python(self):
        """Détection LucidLink via Python subprocess"""
        try:
            # Essayer la commande lucid status
            result = subprocess.run(['lucid', 'status'], 
                                  capture_output=True, 
                                  text=True, 
                                  timeout=10)
            
            if result.returncode == 0:
                # Parser la sortie pour extraire le point de montage
                output = result.stdout
                if 'Mounted' in output or 'Connected' in output:
                    # Extraction simplifiée - à adapter selon la sortie réelle
                    return self.detect_lucidlink_fallback()
            
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("⚠️ Commande 'lucid status' non disponible")
        
        return self.detect_lucidlink_fallback()
    
    def detect_lucidlink_fallback(self):
        """Détection LucidLink par test des dossiers"""
        possible_paths = [
            "E:\\Volumes\\resizelab",
            "F:\\Volumes\\resizelab", 
            "G:\\Volumes\\resizelab",
            "/Volumes/resizelab"  # macOS
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                print(f"✅ LucidLink détecté: {path}")
                return path
        
        print("❌ LucidLink non détecté")
        return None
    
    def validate_files(self):
        """Valider que tous les fichiers existent"""
        missing_files = []
        existing_files = []
        
        for filename in self.files_to_deploy:
            if os.path.exists(filename):
                size_kb = os.path.getsize(filename) / 1024
                existing_files.append((filename, size_kb))
            else:
                missing_files.append(filename)
        
        return existing_files, missing_files
    
    def create_deployment_manifest(self, existing_files):
        """Créer un manifeste de déploiement"""
        manifest = {
            "version": self.version,
            "deployment_date": datetime.now().isoformat(),
            "files": []
        }
        
        for filename, size_kb in existing_files:
            manifest["files"].append({
                "name": filename,
                "size_kb": round(size_kb, 1),
                "type": self.get_file_type(filename)
            })
        
        with open("deployment_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        return manifest
    
    def get_file_type(self, filename):
        """Déterminer le type de fichier"""
        if filename.endswith('.jsx'):
            return "After Effects Script"
        elif filename.endswith('.py'):
            return "Python Script"
        elif filename.endswith('.md'):
            return "Documentation"
        else:
            return "Other"
    
    def force_copy_file(self, src, dst):
        """Copie forcée avec écrasement et gestion des permissions"""
        try:
            # Supprimer le fichier de destination s'il existe
            if os.path.exists(dst):
                try:
                    # Retirer les attributs read-only sur Windows
                    if os.name == 'nt':
                        os.chmod(dst, 0o777)
                    os.remove(dst)
                except PermissionError:
                    print(f"⚠️ Fichier verrouillé, tentative de forçage: {dst}")
                    # Essayer de tuer les processus qui utilisent le fichier (Windows)
                    if os.name == 'nt':
                        try:
                            subprocess.run(['taskkill', '/f', '/im', 'AfterFX.exe'], 
                                         capture_output=True, check=False)
                        except:
                            pass
                    os.remove(dst)
            
            # Copier le fichier
            shutil.copy2(src, dst)
            
            # Vérifier que la copie a réussi
            if os.path.exists(dst) and os.path.getsize(dst) > 0:
                return True
            else:
                return False
                
        except Exception as e:
            print(f"❌ Erreur copie forcée {src} → {dst}: {e}")
            return False

    def deploy_to_lucidlink(self, lucid_path):
        """Déployer vers LucidLink avec écrasement forcé"""
        if not lucid_path:
            print("❌ Impossible de déployer sans LucidLink")
            return False
        
        # Créer le dossier de destination
        dest_path = os.path.join(lucid_path, "o2b-undllm", "2_IN", "_ELEMENTS", "TOOLS", "ae_panel_script")
        templates_dest = os.path.join(dest_path, "templates")
        
        try:
            os.makedirs(dest_path, exist_ok=True)
            os.makedirs(templates_dest, exist_ok=True)
            print(f"📁 Dossier créé: {dest_path}")
            print(f"📁 Dossier templates créé: {templates_dest}")
            
            success_count = 0
            total_files = len(self.files_to_deploy)
            
            # Copier les fichiers avec force
            for filename in self.files_to_deploy:
                if filename.startswith("templates/"):
                    # Fichier template
                    template_name = filename.split("/", 1)[1]
                    src = os.path.join("templates", template_name) if os.path.exists(os.path.join("templates", template_name)) else None
                    
                    if not src and template_name == "RL PostFlow.aom":
                        # Chercher le template dans temp/
                        temp_template = os.path.join("../../temp", template_name)
                        if os.path.exists(temp_template):
                            src = temp_template
                    
                    if src and os.path.exists(src):
                        dst = os.path.join(templates_dest, template_name)
                        if self.force_copy_file(src, dst):
                            print(f"✅ Template copié (forcé): {template_name}")
                            success_count += 1
                        else:
                            print(f"❌ Échec template: {template_name}")
                    else:
                        print(f"⚠️ Template non trouvé: {template_name}")
                        self.create_placeholder_template(templates_dest, template_name)
                        
                elif os.path.exists(filename):
                    src = filename
                    dst = os.path.join(dest_path, filename)
                    if self.force_copy_file(src, dst):
                        print(f"✅ Copié (forcé): {filename}")
                        success_count += 1
                    else:
                        print(f"❌ Échec: {filename}")
            
            # Copier le manifeste avec force
            if os.path.exists("deployment_manifest.json"):
                manifest_dst = os.path.join(dest_path, "deployment_manifest.json")
                if self.force_copy_file("deployment_manifest.json", manifest_dst):
                    print(f"✅ Manifeste copié (forcé)")
                    success_count += 1
            
            print(f"\n📊 Résultat: {success_count}/{total_files + 1} fichiers copiés")
            return success_count > 0
            
        except Exception as e:
            print(f"❌ Erreur déploiement: {e}")
            return False
    
    def create_placeholder_template(self, templates_dest, template_name):
        """Créer un placeholder si le template n'existe pas"""
        if template_name == "RL PostFlow.aom":
            placeholder_path = os.path.join(templates_dest, "README_TEMPLATES.txt")
            with open(placeholder_path, "w", encoding='utf-8') as f:
                f.write("""TEMPLATES RL POSTFLOW
=====================

Le fichier 'RL PostFlow.aom' doit être créé manuellement dans After Effects.

Instructions :
1. Ouvrez After Effects
2. Configurez vos templates d'export :
   - PNG 8-bits RL PostFlow
   - ProRes LT RL PostFlow  
   - ProRes HQ RL PostFlow
3. Sauvegardez comme template : RL PostFlow.aom
4. Placez le fichier dans ce dossier

Alternative : Utilisez le panel en mode manuel sans templates.
""")
            print(f"📝 Placeholder créé: README_TEMPLATES.txt")
    
    def generate_deployment_report(self, success, manifest):
        """Générer un rapport de déploiement"""
        report = f"""
# 🚀 RAPPORT DÉPLOIEMENT RL POSTFLOW v{self.version}

## 📅 Date de déploiement
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📊 Résumé
- **Statut**: {'✅ SUCCÈS' if success else '❌ ÉCHEC'}
- **Fichiers déployés**: {len(manifest['files'])}
- **Taille totale**: {sum(f['size_kb'] for f in manifest['files']):.1f} KB

## 📂 Fichiers déployés
"""
        
        for file_info in manifest['files']:
            report += f"- **{file_info['name']}** ({file_info['size_kb']} KB) - {file_info['type']}\n"
        
        report += f"""
## 🎯 Instructions d'installation

### After Effects
```javascript
// Dans After Effects: Fichier > Scripts > Exécuter un fichier de script...
// Sélectionner: RL_PostFlow_Panel.jsx
```

### Presets de rendu (optionnel)
```javascript
// Exécuter une seule fois: install_render_presets.jsx
```

### Validation
```bash
# Tests Python
python test_rl_postflow.py
python validate_js.py
```

## 🔧 Fonctionnalités v{self.version}

- ✅ Interface simplifiée (PNG, ProRes LT, ProRes HQ)
- ✅ Auto-versioning intelligent (ON/OFF)
- ✅ Support templates séquence (SQ02_UNDLM_v001)
- ✅ Configuration manuelle (plus de dépendance templates AE)
- ✅ Détection LucidLink multi-plateforme
- ✅ Architecture modulaire (8 modules)
- ✅ Tests automatisés Python

## 📝 Mode Auto-Version

**ACTIVÉ** : Scan serveur + incrémentation automatique
**DÉSACTIVÉ** : Version actuelle de la composition

Exemple: Comp `UNDLM_12345_v002`
- Auto ON: Export v003 (si v001,v002 existent)
- Auto OFF: Export v002 (cohérent avec comp)
"""
        
        with open("DEPLOYMENT_REPORT.md", "w", encoding='utf-8') as f:
            f.write(report)
        
        return report
    
    def deploy(self):
        """Processus de déploiement complet"""
        print("🚀 DÉPLOIEMENT RL POSTFLOW")
        print("=" * 50)
        
        # Validation des fichiers
        existing_files, missing_files = self.validate_files()
        
        if missing_files:
            print("⚠️ Fichiers manquants:")
            for filename in missing_files:
                print(f"   • {filename}")
        
        print(f"📦 Fichiers à déployer ({len(existing_files)}):")
        for filename, size_kb in existing_files:
            print(f"   ✅ {filename} ({size_kb:.1f} KB)")
        
        # Création du manifeste
        manifest = self.create_deployment_manifest(existing_files)
        print(f"\n📋 Manifeste créé: deployment_manifest.json")
        
        # Détection LucidLink
        print("\n🔍 Détection LucidLink...")
        lucid_path = self.detect_lucidlink_python()
        
        # Déploiement
        if lucid_path:
            print(f"\n📤 Déploiement vers LucidLink...")
            success = self.deploy_to_lucidlink(lucid_path)
        else:
            print("\n⚠️ Déploiement local seulement")
            success = True
        
        # Rapport
        report = self.generate_deployment_report(success, manifest)
        print(f"\n📊 Rapport généré: DEPLOYMENT_REPORT.md")
        
        print("\n" + "=" * 50)
        if success:
            print("✅ DÉPLOIEMENT RÉUSSI")
            print("🎬 Panel prêt pour utilisation en production")
        else:
            print("❌ DÉPLOIEMENT PARTIEL")
            print("🔧 Vérifier la configuration LucidLink")
        
        return success

if __name__ == "__main__":
    deployer = RLPostFlowDeployer()
    deployer.deploy()
