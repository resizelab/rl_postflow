#!/usr/bin/env python3
"""
Test du système de raccourcissement de liens Frame.io
"""

def test_link_shortener():
    """Test la génération de liens courts pour Google Sheets"""
    
    # URL Frame.io typique
    test_url = "https://next.frame.io/project/c5dc0e94-8f0a-48b4-8f34-ae672bb59f0f/view/44b7b6a7-91d3-403d-b9a5-c7f321c0e55c"
    shot_id = "UNDLM_00150"
    version = "v001"
    
    print("=== TEST RACCOURCISSEMENT DE LIENS ===")
    print(f"URL originale: {test_url}")
    print(f"Shot ID: {shot_id}")
    print(f"Version: {version}")
    print()
    
    # Générer le lien court
    clean_shot_id = shot_id.replace("UNDLM_", "")
    version_clean = version.upper().replace("V", "_V")
    short_link = f"REVIEW_{clean_shot_id}{version_clean}"
    
    print(f"Lien court généré: {short_link}")
    print()
    
    # Formule HYPERLINK pour Google Sheets
    escaped_url = test_url.replace('"', '""')
    hyperlink_formula = f'=HYPERLINK("{escaped_url}","{short_link}")'
    
    print("Formule Google Sheets:")
    print(hyperlink_formula)
    print()
    
    # Test avec différents cas
    test_cases = [
        ("UNDLM_00146", "v001"),
        ("UNDLM_00148", "v002"),
        ("UNDLM_00150", "v001"),
        ("UNDLM_00152", "v001"),
        ("UNDLM_00161", "v001"),
        ("UNDLM_00163", "v001"),
    ]
    
    print("=== TESTS AVEC DIFFÉRENTS SHOT IDS ===")
    for shot, ver in test_cases:
        clean = shot.replace("UNDLM_", "")
        ver_clean = ver.upper().replace("V", "_V")
        short = f"REVIEW_{clean}{ver_clean}"
        print(f"{shot} {ver} → {short}")

if __name__ == "__main__":
    test_link_shortener()
