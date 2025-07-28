#!/usr/bin/env python3
"""
Helper pour détecter LucidLink et générer la configuration pour After Effects
"""

import os
import subprocess
import json
from pathlib import Path

class LucidLinkDetector:
    def __init__(self):
        pass
    
    def detect_lucidlink_advanced(self):
        """Détection LucidLink avancée avec plusieurs méthodes"""
        methods = [
            self.detect_via_lucid_command,
            self.detect_via_registry,
            self.detect_via_filesystem
        ]
        
        for method in methods:
            try:
                result = method()
                if result:
                    return result
            except Exception as e:
                print(f"⚠️ Méthode échouée: {e}")
                continue
        
        return None
    
    def detect_via_lucid_command(self):
        """Détection via commande lucid status avec chemins complets"""
        lucid_paths = [
            'lucid',  # Dans PATH
            'C:\\Program Files\\Lucid\\lucid.exe',
            'C:\\Program Files (x86)\\Lucid\\lucid.exe',
            os.path.expanduser('~\\AppData\\Local\\Lucid\\lucid.exe'),
            os.path.expanduser('~\\AppData\\Roaming\\Lucid\\lucid.exe')
        ]
        
        for lucid_cmd in lucid_paths:
            try:
                result = subprocess.run([lucid_cmd, 'status'], 
                                      capture_output=True, 
                                      text=True, 
                                      timeout=10)
                
                if result.returncode == 0:
                    mount_point = self.extract_mount_point(result.stdout)
                    if mount_point:
                        return {
                            'method': 'lucid_command',
                            'command': lucid_cmd,
                            'mount_point': mount_point,
                            'full_output': result.stdout
                        }
                        
            except (subprocess.TimeoutExpired, FileNotFoundError):
                continue
        
        return None
    
    def detect_via_registry(self):
        """Détection via registre Windows (si disponible)"""
        try:
            import winreg
            
            reg_paths = [
                (winreg.HKEY_CURRENT_USER, "Software\\Lucid"),
                (winreg.HKEY_LOCAL_MACHINE, "Software\\Lucid"),
                (winreg.HKEY_LOCAL_MACHINE, "Software\\WOW6432Node\\Lucid")
            ]
            
            for hkey, subkey in reg_paths:
                try:
                    with winreg.OpenKey(hkey, subkey) as key:
                        install_path = winreg.QueryValueEx(key, "InstallPath")[0]
                        lucid_exe = os.path.join(install_path, "lucid.exe")
                        if os.path.exists(lucid_exe):
                            # Tenter d'exécuter lucid status
                            result = subprocess.run([lucid_exe, 'status'], 
                                                  capture_output=True, 
                                                  text=True, 
                                                  timeout=10)
                            if result.returncode == 0:
                                mount_point = self.extract_mount_point(result.stdout)
                                if mount_point:
                                    return {
                                        'method': 'registry',
                                        'command': lucid_exe,
                                        'mount_point': mount_point,
                                        'registry_path': f"{hkey}\\{subkey}"
                                    }
                except:
                    continue
                    
        except ImportError:
            pass  # winreg non disponible (pas Windows)
        
        return None
    
    def detect_via_filesystem(self):
        """Détection par scan des dossiers typiques"""
        possible_paths = [
            "E:\\Volumes\\resizelab",
            "F:\\Volumes\\resizelab", 
            "G:\\Volumes\\resizelab",
            "H:\\Volumes\\resizelab",
            "/Volumes/resizelab"  # macOS
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                # Vérifier si c'est vraiment LucidLink
                lucid_markers = [
                    os.path.join(path, ".lucid"),
                    os.path.join(path, "o2b-undllm"),
                    os.path.join(path, "o2b-undllm", "2_IN")
                ]
                
                for marker in lucid_markers:
                    if os.path.exists(marker):
                        return {
                            'method': 'filesystem_scan',
                            'mount_point': path,
                            'marker_found': marker
                        }
        
        return None
    
    def extract_mount_point(self, lucid_output):
        """Extraire le point de montage depuis la sortie de lucid status"""
        try:
            lines = lucid_output.split('\n')
            for line in lines:
                if line.startswith('Mount point:'):
                    mount_point = line.split('Mount point:', 1)[1].strip()
                    if mount_point and os.path.exists(mount_point):
                        # Extraire le chemin racine (avant le filespace)
                        path_parts = mount_point.replace('\\', '/').split('/')
                        if len(path_parts) >= 3:
                            root_path = '/'.join(path_parts[:-1]).replace('/', os.sep)
                            if os.path.exists(root_path):
                                return root_path
                        return mount_point
            return None
        except Exception as e:
            print(f"⚠️ Erreur parsing mount point: {e}")
            return None
    
    def generate_jsx_config(self, detection_result):
        """Générer la configuration pour JSX"""
        if not detection_result:
            return None
        
        config = {
            'lucidlink_detected': True,
            'mount_point': detection_result['mount_point'],
            'detection_method': detection_result['method'],
            'timestamp': str(Path(__file__).stat().st_mtime),
            'os_type': 'windows' if os.name == 'nt' else 'mac',
            'jsx_paths': {
                'base_path': detection_result['mount_point'],
                'project_path': os.path.join(detection_result['mount_point'], 'o2b-undllm'),
                'tools_path': os.path.join(detection_result['mount_point'], 'o2b-undllm', '2_IN', '_ELEMENTS', 'TOOLS'),
                'ae_panel_path': os.path.join(detection_result['mount_point'], 'o2b-undllm', '2_IN', '_ELEMENTS', 'TOOLS', 'ae_panel_script')
            }
        }
        
        return config
    
    def save_config_for_jsx(self, config, output_file="lucidlink_config.json"):
        """Sauvegarder la configuration pour JSX"""
        if config:
            with open(output_file, 'w') as f:
                json.dump(config, f, indent=2)
            print(f"✅ Configuration sauvegardée: {output_file}")
            return True
        return False

def main():
    detector = LucidLinkDetector()
    
    print("🔍 DÉTECTION LUCIDLINK AVANCÉE")
    print("=" * 40)
    
    result = detector.detect_lucidlink_advanced()
    
    if result:
        print(f"✅ LucidLink détecté:")
        print(f"   Méthode: {result['method']}")
        print(f"   Point de montage: {result['mount_point']}")
        
        config = detector.generate_jsx_config(result)
        if detector.save_config_for_jsx(config):
            print("✅ Configuration générée pour After Effects")
        
        return True
    else:
        print("❌ LucidLink non détecté")
        return False

if __name__ == "__main__":
    main()
