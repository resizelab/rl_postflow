#!/usr/bin/env python3
"""
Test de diagnostic avancé pour Frame.io + S3
"""
import requests
import json
from urllib.parse import urlparse, parse_qs

def analyze_presigned_url(url):
    """Analyser en détail l'URL pré-signée"""
    print("=== ANALYSE URL PRE-SIGNEE ===")
    
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    print(f"Scheme: {parsed.scheme}")
    print(f"Host: {parsed.netloc}")
    print(f"Path: {parsed.path}")
    
    print("\n=== PARAMETRES AWS ===")
    for key, value in params.items():
        if key.startswith('X-Amz') or key.startswith('x-amz'):
            print(f"{key}: {value[0] if value else 'EMPTY'}")
    
    # Analyser la signature
    signed_headers = params.get('X-Amz-SignedHeaders', [''])[0]
    print(f"\nHeaders signés: {signed_headers}")
    
    if 'host' in signed_headers:
        print(f"⚠️  ATTENTION: 'host' est dans les headers signés")
        print(f"Le host doit être exactement: {parsed.netloc}")
    
    return {
        'host': parsed.netloc,
        'path': parsed.path,
        'signed_headers': signed_headers.split(';') if signed_headers else [],
        'algorithm': params.get('X-Amz-Algorithm', [''])[0]
    }

def test_minimal_upload():
    """Test minimal avec une URL fictive pour valider la logique"""
    print("\n=== TEST AVEC CURL EQUIVALENT ===")
    
    # Simulation d'un upload avec curl equivalent
    example_commands = [
        "# Test 1: Sans headers",
        "curl -X PUT 'URL' --data-binary @file.txt",
        "",
        "# Test 2: Avec Content-Type",
        "curl -X PUT 'URL' -H 'Content-Type: text/plain' --data-binary @file.txt",
        "",
        "# Test 3: Headers minimalistes",
        "curl -X PUT 'URL' -H 'content-type: ' -H 'x-amz-acl: ' --data-binary @file.txt"
    ]
    
    for cmd in example_commands:
        print(cmd)

def extract_signature_debug_info(error_text):
    """Extraire les infos de debug de l'erreur AWS"""
    print("\n=== ANALYSE ERREUR AWS ===")
    
    if "StringToSign" in error_text:
        lines = error_text.split('\n')
        for i, line in enumerate(lines):
            if 'StringToSign' in line:
                print("String to Sign AWS:")
                # Afficher les lignes suivantes qui contiennent la signature
                for j in range(i+1, min(i+10, len(lines))):
                    if lines[j].strip() and not lines[j].startswith('<'):
                        print(f"  {lines[j]}")
                break
    
    if "CanonicalRequest" in error_text:
        print("\n⚠️  L'erreur contient CanonicalRequest - cela signifie un problème de format")

def test_with_frameio_url():
    """Test avec une vraie URL Frame.io si disponible"""
    print("\n=== RECOMMENDATIONS ===")
    
    recommendations = [
        "1. Vérifier que l'URL n'est pas modifiée entre génération et usage",
        "2. Tester avec exactement 0 headers custom (laisser requests gérer)",
        "3. Vérifier que le fichier n'est pas modifié (checksum avant/après)",
        "4. Tester avec un fichier plus petit (1-2 bytes)",
        "5. Vérifier le timing (URL expire après combien de temps ?)",
        "6. Essayer avec un autre client HTTP (urllib3 raw, curl)",
        "7. Capturer la requête exacte avec Wireshark/tcpdump"
    ]
    
    for rec in recommendations:
        print(rec)

if __name__ == "__main__":
    print("DIAGNOSTIC FRAME.IO + S3 UPLOAD")
    print("==============================")
    
    # Exemple avec une URL Frame.io type
    example_url = "https://frameio-uploads-production.s3-accelerate.amazonaws.com/uploads/FILE_ID/original.ext?x-amz-meta-asset_id=XXX&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=XXX&X-Amz-Date=XXX&X-Amz-Expires=86400&X-Amz-SignedHeaders=content-type%3Bhost%3Bx-amz-acl&X-Amz-Signature=XXX"
    
    analyze_presigned_url(example_url)
    test_minimal_upload()
    test_with_frameio_url()
    
    print("\n=== PROCHAINES ETAPES ===")
    print("1. Récupérer une vraie URL Frame.io et l'analyser avec ce script")
    print("2. Tester l'upload avec un fichier de 1 byte")
    print("3. Comparer avec la doc officielle AWS S3 presigned URLs")
    print("4. Contacter le support Frame.io si le problème persiste")
