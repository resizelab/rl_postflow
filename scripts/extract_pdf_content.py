#!/usr/bin/env python3
"""
Script pour extraire le texte du PDF UNDM_WFlow_Animation_01.pdf
"""

import sys
from pathlib import Path
import pypdf

def extract_pdf_text(pdf_path):
    """Extrait le texte d'un fichier PDF."""
    try:
        with open(pdf_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            text = ""
            
            print(f"PDF trouvé: {len(reader.pages)} pages")
            
            for page_num, page in enumerate(reader.pages, 1):
                print(f"Extraction page {page_num}...")
                page_text = page.extract_text()
                text += f"\n--- PAGE {page_num} ---\n"
                text += page_text
                text += "\n"
            
            return text
    except Exception as e:
        print(f"Erreur lors de l'extraction: {e}")
        return None

def main():
    pdf_path = Path("data/UNDM_WFlow_Animation_01.pdf")
    
    if not pdf_path.exists():
        print(f"Fichier PDF non trouvé: {pdf_path}")
        sys.exit(1)
    
    print(f"Extraction du texte de: {pdf_path}")
    text = extract_pdf_text(pdf_path)
    
    if text:
        # Sauvegarder le texte extrait
        output_path = Path("data/UNDM_WFlow_Animation_01_extracted.txt")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"Texte extrait sauvegardé dans: {output_path}")
        
        # Afficher un aperçu
        print("\n=== APERÇU DU CONTENU (premiers 2000 caractères) ===")
        print(text[:2000])
        if len(text) > 2000:
            print("\n... (contenu tronqué)")
        
    else:
        print("Échec de l'extraction du texte")
        sys.exit(1)

if __name__ == "__main__":
    main()
