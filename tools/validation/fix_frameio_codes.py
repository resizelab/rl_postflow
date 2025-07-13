#!/usr/bin/env python3
"""
Outil de correction finale des codes textuels Frame.io
Remplace les codes [TEXTE] restants par des emojis
"""

import os
import re
from pathlib import Path

class FrameioCodeFixer:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        
        # Mapping des codes vers emojis
        self.emoji_map = {
            r'\[OK\]': '✅',
            r'\[ROCKET\]': '🚀',
            r'\[GLOBE\]': '🌐',
            r'\[ERROR\]': '❌',
            r'\[WARNING\]': '⚠️',
            r'\[OUTBOX\]': '📤',
            r'\[FOLDER\]': '📁',
            r'\[PLUG\]': '🔌',
        }
        
        # Fichiers Frame.io à corriger
        self.target_files = [
            'src/integrations/frameio/upload.py',
            'src/integrations/frameio/range_server.py', 
            'src/integrations/frameio/auth.py',
            'src/integrations/frameio/structure.py',
            'src/integrations/frameio/parser.py',
            'src/integrations/frameio/production_upload.py',
            'src/integrations/lucidlink.py',
        ]
    
    def fix_frameio_files(self):
        """Corrige tous les fichiers Frame.io"""
        fixed_count = 0
        
        for file_rel_path in self.target_files:
            file_path = self.base_path / file_rel_path
            if file_path.exists():
                if self.fix_file(file_path):
                    fixed_count += 1
                    
        print(f"✅ {fixed_count} fichiers Frame.io corrigés")
    
    def fix_file(self, file_path: Path) -> bool:
        """Corrige un fichier spécifique"""
        try:
            # Lecture du fichier
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Application des remplacements
            original_content = content
            for code_pattern, emoji in self.emoji_map.items():
                content = re.sub(code_pattern, emoji, content)
            
            # Sauvegarde si des changements ont été faits
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"🔧 Corrigé: {file_path.relative_to(self.base_path)}")
                return True
                
        except Exception as e:
            print(f"❌ Erreur sur {file_path}: {e}")
            
        return False

if __name__ == "__main__":
    # Chemin de base du projet
    base_path = Path(__file__).parent.parent.parent
    
    print("🚀 Correction finale des codes Frame.io...")
    fixer = FrameioCodeFixer(str(base_path))
    fixer.fix_frameio_files()
    print("✅ Correction Frame.io terminée")
