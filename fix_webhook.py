#!/usr/bin/env python3
import re

def fix_webhook_manager():
    file_path = 'src/integrations/frameio/webhook_manager.py'
    
    # Lire le fichier
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Corriger la ligne problématique
    content = re.sub(
        r'logger\.info\(f"🎯 Webhook Frame\.io V4 reçu: file\.ready"\)""',
        'logger.info(f"🎯 Webhook Frame.io V4 reçu: file.ready")',
        content
    )
    
    # Supprimer les lignes dupliquées
    lines = content.split('\n')
    cleaned_lines = []
    skip_next = False
    
    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue
            
        # Supprimer les lignes dupliquées de file_id/file_name
        if 'file_id = file_data.get("id")' in line and i > 0:
            # Vérifier si c'est une duplication
            prev_lines = '\n'.join(lines[max(0, i-5):i])
            if 'file_id = file_data.get("id")' in prev_lines:
                # C'est une duplication, ignorer cette ligne et les suivantes
                if i+1 < len(lines) and 'file_name = file_data.get("name")' in lines[i+1]:
                    skip_next = True
                continue
        
        cleaned_lines.append(line)
    
    # Réécrire le fichier
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines))
    
    print("✅ Fichier webhook_manager.py corrigé")

if __name__ == "__main__":
    fix_webhook_manager()
