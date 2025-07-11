#!/usr/bin/env python3
"""
Analyseur de Structure After Effects (.aep)
Extrait la structure complète d'un projet After Effects
"""

import struct
import os
import re
from pathlib import Path
import json
from typing import Dict, List, Any, Optional

class AEPAnalyzer:
    """Analyseur de fichiers After Effects (.aep)."""
    
    def __init__(self, aep_file_path: str):
        self.file_path = Path(aep_file_path)
        self.data = None
        self.structure = {}
        self.compositions = []
        self.footage_items = []
        self.folders = []
        self.assets = []
        
    def load_file(self) -> bool:
        """Charge le fichier .aep en mémoire."""
        try:
            with open(self.file_path, 'rb') as f:
                self.data = f.read()
            print(f"✅ Fichier chargé : {len(self.data)} bytes")
            return True
        except Exception as e:
            print(f"❌ Erreur chargement : {e}")
            return False
    
    def analyze_riff_structure(self) -> Dict:
        """Analyse la structure RIFF du fichier .aep."""
        if not self.data:
            return {}
            
        print("\n🔍 Analyse structure RIFF...")
        
        structure = {
            'format': 'Unknown',
            'chunks': [],
            'total_size': len(self.data),
            'magic_numbers': []
        }
        
        try:
            # Vérifier signature RIFF
            if self.data[:4] == b'RIFF':
                structure['format'] = 'RIFF'
                file_size = struct.unpack('<I', self.data[4:8])[0]
                structure['declared_size'] = file_size
                
                # Type de fichier (devrait être 'RIFX' pour AE)
                file_type = self.data[8:12]
                structure['file_type'] = file_type.decode('ascii', errors='ignore')
                
                print(f"   Format : {structure['format']}")
                print(f"   Type : {structure['file_type']}")
                print(f"   Taille déclarée : {file_size}")
                
            # Analyser les chunks
            offset = 12  # Après l'en-tête RIFF
            while offset < len(self.data) - 8:
                try:
                    chunk_id = self.data[offset:offset+4]
                    chunk_size = struct.unpack('<I', self.data[offset+4:offset+8])[0]
                    
                    chunk_info = {
                        'id': chunk_id.decode('ascii', errors='ignore'),
                        'size': chunk_size,
                        'offset': offset,
                        'data_preview': self.data[offset+8:offset+8+min(32, chunk_size)]
                    }
                    
                    structure['chunks'].append(chunk_info)
                    
                    # Chercher des signatures After Effects
                    if chunk_id in [b'ADBE', b'BTDK', b'WDGT', b'COMP']:
                        structure['magic_numbers'].append({
                            'signature': chunk_id.decode('ascii', errors='ignore'),
                            'offset': offset,
                            'size': chunk_size
                        })
                    
                    offset += 8 + chunk_size
                    
                    # Alignement sur 2 bytes si nécessaire
                    if chunk_size % 2:
                        offset += 1
                        
                except Exception as e:
                    print(f"⚠️  Erreur chunk à offset {offset}: {e}")
                    break
                    
        except Exception as e:
            print(f"❌ Erreur analyse RIFF : {e}")
            
        return structure
    
    def search_text_patterns(self) -> Dict:
        """Recherche des patterns texte dans le fichier."""
        if not self.data:
            return {}
            
        print("\n🔍 Recherche patterns texte...")
        
        patterns = {
            'SQXX': [],
            'XXX': [],
            '00XXX': [],
            'UNDLM': [],
            'compositions': [],
            'footage': [],
            'folders': [],
            'effects': [],
            'precomps': []
        }
        
        # Recherche patterns de base
        text_data = self.data.decode('latin-1', errors='ignore')
        
        # SQXX patterns
        import re
        
        # Patterns spécifiques RL PostFlow
        sqxx_matches = [(m.start(), m.group()) for m in re.finditer(r'SQXX', text_data)]
        patterns['SQXX'] = sqxx_matches[:10]  # Limiter pour l'affichage
        
        xxx_matches = [(m.start(), m.group()) for m in re.finditer(r'\b\d*XXX\b', text_data)]
        patterns['XXX'] = xxx_matches[:10]
        
        undlm_matches = [(m.start(), m.group()) for m in re.finditer(r'UNDLM_\d+', text_data)]
        patterns['UNDLM'] = undlm_matches[:10]
        
        # Patterns After Effects
        comp_matches = [(m.start(), m.group()) for m in re.finditer(r'Comp \d+|Composition|comp_\w+', text_data, re.IGNORECASE)]
        patterns['compositions'] = comp_matches[:10]
        
        footage_matches = [(m.start(), m.group()) for m in re.finditer(r'\w+\.(mov|mp4|avi|png|jpg|tga|exr)', text_data, re.IGNORECASE)]
        patterns['footage'] = footage_matches[:10]
        
        effect_matches = [(m.start(), m.group()) for m in re.finditer(r'ADBE \w+|CC \w+|Fast Blur|Gaussian Blur', text_data)]
        patterns['effects'] = effect_matches[:10]
        
        return patterns
    
    def extract_project_settings(self) -> Dict:
        """Extrait les paramètres du projet."""
        if not self.data:
            return {}
            
        print("\n🔍 Extraction paramètres projet...")
        
        settings = {
            'version': 'Unknown',
            'frame_rate': 'Unknown',
            'dimensions': 'Unknown',
            'duration': 'Unknown',
            'color_depth': 'Unknown',
            'work_area': 'Unknown'
        }
        
        try:
            # Recherche de patterns binaires typiques d'After Effects
            text_data = self.data.decode('latin-1', errors='ignore')
            
            # Version After Effects
            version_match = re.search(r'After Effects (\d+\.\d+)', text_data)
            if version_match:
                settings['version'] = version_match.group(1)
            
            # Frame rate (patterns typiques : 25.00, 29.97, 30.00)
            fps_match = re.search(r'(\d{2}\.\d{2}) fps|(\d{2}\.\d{2})frames', text_data)
            if fps_match:
                settings['frame_rate'] = fps_match.group(1) or fps_match.group(2)
            
            # Dimensions (1920x1080, etc.)
            dim_match = re.search(r'(\d{3,4})x(\d{3,4})', text_data)
            if dim_match:
                settings['dimensions'] = f"{dim_match.group(1)}x{dim_match.group(2)}"
            
            # Chercher des indices de durée en frames
            duration_match = re.search(r'duration.{0,20}(\d+)', text_data, re.IGNORECASE)
            if duration_match:
                settings['duration'] = f"{duration_match.group(1)} frames"
                
        except Exception as e:
            print(f"⚠️  Erreur extraction paramètres : {e}")
            
        return settings
    
    def find_asset_references(self) -> List[Dict]:
        """Trouve toutes les références d'assets (fichiers sources)."""
        if not self.data:
            return []
            
        print("\n🔍 Recherche références assets...")
        
        assets = []
        text_data = self.data.decode('latin-1', errors='ignore')
        
        # Patterns de chemins de fichiers
        path_patterns = [
            r'/[^/\n]+/[^/\n]+/[^\n]+\.(mov|mp4|avi|png|jpg|tga|exr|aep)',
            r'[A-Z]:\\[^\\n]+\\[^\\n]+\\[^\n]+\.(mov|mp4|avi|png|jpg|tga|exr|aep)',
            r'file://[^\n]+\.(mov|mp4|avi|png|jpg|tga|exr|aep)',
            r'[^/\\n]+\.(mov|mp4|avi|png|jpg|tga|exr|aep)'
        ]
        
        for pattern in path_patterns:
            matches = re.finditer(pattern, text_data, re.IGNORECASE)
            for match in matches:
                asset_path = match.group()
                if len(asset_path) > 4:  # Filtrer les matches trop courts
                    assets.append({
                        'path': asset_path,
                        'type': asset_path.split('.')[-1].lower(),
                        'offset': match.start(),
                        'contains_pattern': any(p in asset_path for p in ['SQXX', 'XXX', 'UNDLM'])
                    })
        
        # Dédupliquer et limiter
        unique_assets = []
        seen_paths = set()
        for asset in assets:
            if asset['path'] not in seen_paths:
                seen_paths.add(asset['path'])
                unique_assets.append(asset)
                if len(unique_assets) >= 20:  # Limiter pour l'affichage
                    break
        
        return unique_assets
    
    def extract_compositions(self) -> List[Dict]:
        """Extrait les informations sur les compositions."""
        if not self.data:
            return []
            
        print("\n🔍 Extraction compositions...")
        
        compositions = []
        text_data = self.data.decode('latin-1', errors='ignore')
        
        # Recherche patterns de compositions
        comp_patterns = [
            r'(SQXX[^\\x00\\n]{0,50})',
            r'(Comp \d+[^\\x00\\n]{0,30})',
            r'([^\\x00\\n]{0,20}composition[^\\x00\\n]{0,30})',
        ]
        
        for pattern in comp_patterns:
            matches = re.finditer(pattern, text_data, re.IGNORECASE)
            for match in matches:
                comp_name = match.group(1).strip()
                if len(comp_name) > 2 and comp_name not in [c['name'] for c in compositions]:
                    compositions.append({
                        'name': comp_name,
                        'offset': match.start(),
                        'has_pattern': any(p in comp_name for p in ['SQXX', 'XXX', 'UNDLM'])
                    })
                    
                    if len(compositions) >= 10:  # Limiter
                        break
        
        return compositions
    
    def generate_report(self) -> Dict:
        """Génère un rapport complet de l'analyse."""
        print(f"\n📊 RAPPORT D'ANALYSE : {self.file_path.name}")
        print("=" * 60)
        
        # Structure RIFF
        riff_structure = self.analyze_riff_structure()
        
        # Patterns texte
        text_patterns = self.search_text_patterns()
        
        # Paramètres projet
        project_settings = self.extract_project_settings()
        
        # Assets
        assets = self.find_asset_references()
        
        # Compositions
        compositions = self.extract_compositions()
        
        report = {
            'file_info': {
                'path': str(self.file_path),
                'size': len(self.data) if self.data else 0,
                'size_mb': round(len(self.data) / 1024 / 1024, 2) if self.data else 0
            },
            'riff_structure': riff_structure,
            'project_settings': project_settings,
            'text_patterns': text_patterns,
            'assets': assets,
            'compositions': compositions,
            'analysis_summary': {
                'total_chunks': len(riff_structure.get('chunks', [])),
                'sqxx_count': len(text_patterns.get('SQXX', [])),
                'xxx_count': len(text_patterns.get('XXX', [])),
                'undlm_count': len(text_patterns.get('UNDLM', [])),
                'assets_count': len(assets),
                'compositions_count': len(compositions)
            }
        }
        
        return report
    
    def print_summary(self, report: Dict):
        """Affiche un résumé de l'analyse."""
        
        print(f"\n📋 RÉSUMÉ ANALYSE")
        print("-" * 40)
        
        file_info = report['file_info']
        print(f"📁 Fichier : {file_info['path']}")
        print(f"📏 Taille : {file_info['size_mb']} MB")
        
        summary = report['analysis_summary']
        print(f"\n🎯 Patterns trouvés :")
        print(f"   • SQXX : {summary['sqxx_count']}")
        print(f"   • XXX : {summary['xxx_count']}")
        print(f"   • UNDLM : {summary['undlm_count']}")
        
        print(f"\n🎬 Structure :")
        print(f"   • Chunks RIFF : {summary['total_chunks']}")
        print(f"   • Compositions : {summary['compositions_count']}")
        print(f"   • Assets : {summary['assets_count']}")
        
        # Paramètres projet
        settings = report['project_settings']
        print(f"\n⚙️  Paramètres projet :")
        for key, value in settings.items():
            print(f"   • {key.replace('_', ' ').title()} : {value}")
        
        # Échantillons assets
        assets = report['assets']
        if assets:
            print(f"\n📦 Échantillons assets :")
            for asset in assets[:5]:
                pattern_flag = "🎯" if asset['contains_pattern'] else "  "
                print(f"   {pattern_flag} {asset['type'].upper()} : {asset['path'][:60]}...")
        
        # Échantillons compositions
        compositions = report['compositions']
        if compositions:
            print(f"\n🎭 Échantillons compositions :")
            for comp in compositions[:5]:
                pattern_flag = "🎯" if comp['has_pattern'] else "  "
                print(f"   {pattern_flag} {comp['name']}")

def analyze_ae_template(aep_file_path: str) -> Optional[Dict]:
    """Analyse un fichier .aep et retourne le rapport."""
    
    print(f"🎬 ANALYSEUR AFTER EFFECTS TEMPLATE")
    print("=" * 50)
    
    analyzer = AEPAnalyzer(aep_file_path)
    
    if not analyzer.load_file():
        return None
    
    report = analyzer.generate_report()
    analyzer.print_summary(report)
    
    return report

def main():
    """Fonction principale."""
    
    # Chemin vers le template
    template_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/_AE/SQXX_01.aep"
    
    # Vérifier existence
    if not Path(template_path).exists():
        print(f"❌ Fichier non trouvé : {template_path}")
        return
    
    # Analyser
    report = analyze_ae_template(template_path)
    
    if report:
        # Convertir les bytes en strings pour la sérialisation JSON
        def convert_bytes_to_str(obj):
            if isinstance(obj, bytes):
                try:
                    return obj.decode('utf-8', errors='replace')
                except:
                    return obj.hex()
            elif isinstance(obj, dict):
                return {k: convert_bytes_to_str(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_bytes_to_str(item) for item in obj]
            return obj
        
        serializable_report = convert_bytes_to_str(report)
        
        # Sauvegarder le rapport
        output_path = Path(__file__).parent.parent / "temp" / "ae_template_analysis.json"
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(serializable_report, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Rapport sauvegardé : {output_path}")
        
        # Suggestions
        print(f"\n🚀 RECOMMANDATIONS :")
        
        sqxx_count = report['analysis_summary']['sqxx_count']
        if sqxx_count > 0:
            print(f"✅ {sqxx_count} occurrences 'SQXX' trouvées - Renommage possible")
        else:
            print(f"⚠️  Aucune occurrence 'SQXX' - Vérifier le template")
        
        xxx_count = report['analysis_summary']['xxx_count'] 
        if xxx_count > 0:
            print(f"✅ {xxx_count} occurrences 'XXX' trouvées - Renommage plans possible")
        
        assets_count = report['analysis_summary']['assets_count']
        if assets_count > 0:
            print(f"✅ {assets_count} assets détectés - Vérifier les chemins")
        
        print(f"\n📋 PROCHAINES ÉTAPES :")
        print(f"1. Valider les patterns trouvés")
        print(f"2. Tester le renommage sur une copie")
        print(f"3. Créer script ExtendScript de modification")
        print(f"4. Intégrer au pipeline de déploiement")

if __name__ == "__main__":
    main()
