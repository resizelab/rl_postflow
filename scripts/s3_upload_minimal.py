#!/usr/bin/env python3
"""
Upload minimal vers S3 avec URL pré-signée - Version robuste pour Frame.io v4
"""
import requests
import hashlib
import os
from urllib.parse import urlparse, parse_qs

def upload_to_s3_presigned(file_path, presigned_url, content_type=None, debug=True):
    """
    Upload robuste vers S3 avec URL pré-signée
    
    Args:
        file_path: Chemin vers le fichier à uploader
        presigned_url: URL pré-signée de S3
        content_type: Type MIME (optionnel, détecté automatiquement)
        debug: Afficher les détails de debug
    
    Returns:
        (success: bool, response: requests.Response, details: dict)
    """
    
    if not os.path.exists(file_path):
        return False, None, {"error": "Fichier introuvable"}
    
    # Analyser l'URL pré-signée pour extraire les informations
    parsed_url = urlparse(presigned_url)
    query_params = parse_qs(parsed_url.query)
    
    # Informations extraites de l'URL
    signed_headers = query_params.get('X-Amz-SignedHeaders', [''])[0]
    signature = query_params.get('X-Amz-Signature', [''])[0]
    algorithm = query_params.get('X-Amz-Algorithm', [''])[0]
    
    if debug:
        print(f"[DEBUG] Fichier: {file_path} ({os.path.getsize(file_path)} bytes)")
        print(f"[DEBUG] Host S3: {parsed_url.netloc}")
        print(f"[DEBUG] Path S3: {parsed_url.path}")
        print(f"[DEBUG] Headers signés: {signed_headers}")
        print(f"[DEBUG] Algorithme: {algorithm}")
    
    # Détection automatique du Content-Type si non fourni
    if content_type is None:
        ext = os.path.splitext(file_path)[1].lower()
        content_type_map = {
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo',
            '.txt': 'text/plain',
            '.json': 'application/json',
            '.jpg': 'image/jpeg',
            '.png': 'image/png'
        }
        content_type = content_type_map.get(ext, 'application/octet-stream')
    
    if debug:
        print(f"[DEBUG] Content-Type détecté: {content_type}")
    
    # Lire le fichier en mémoire (pour les petits fichiers)
    file_size = os.path.getsize(file_path)
    if file_size > 100 * 1024 * 1024:  # 100MB
        print(f"[WARNING] Fichier volumineux ({file_size} bytes), upload en streaming")
    
    # Configuration des headers selon l'analyse de l'URL signée
    headers_configs = [
        {
            "name": "Headers exacts selon signature AWS",
            "headers": {}  # Aucun header custom, laisser requests gérer
        },
        {
            "name": "Content-Type seulement",
            "headers": {
                "Content-Type": content_type
            }
        },
        {
            "name": "Headers minimalistes (content-type vide)",
            "headers": {
                "content-type": ""  # Exactement comme dans la signature
            }
        },
        {
            "name": "Headers explicites selon signature",
            "headers": {
                "content-type": content_type,
                "x-amz-acl": ""  # Vide selon l'analyse précédente
            }
        }
    ]
    
    # Test de chaque configuration
    for i, config in enumerate(headers_configs):
        if debug:
            print(f"\n[TEST {i+1}] {config['name']}")
            print(f"[DEBUG] Headers: {config['headers']}")
        
        try:
            # Upload avec streaming pour gérer les gros fichiers
            with open(file_path, 'rb') as file_obj:
                response = requests.put(
                    presigned_url,
                    data=file_obj,
                    headers=config['headers'],
                    timeout=300  # 5 minutes timeout
                )
            
            if debug:
                print(f"[RESULT] Status: {response.status_code}")
                print(f"[RESULT] Headers réponse: {dict(response.headers)}")
            
            # Succès S3 : 200, 201, ou 204
            if response.status_code in (200, 201, 204):
                return True, response, {
                    "config_used": config['name'],
                    "status_code": response.status_code,
                    "response_headers": dict(response.headers)
                }
            else:
                if debug:
                    error_preview = response.text[:300] if response.text else "Pas de contenu d'erreur"
                    print(f"[FAIL] Erreur: {error_preview}")
                    
        except Exception as e:
            if debug:
                print(f"[EXCEPTION] {str(e)}")
            continue
    
    # Toutes les configurations ont échoué
    return False, response, {
        "error": "Toutes les configurations d'upload ont échoué",
        "last_status": response.status_code if 'response' in locals() else None
    }

def validate_presigned_url(presigned_url):
    """Valider une URL pré-signée S3"""
    parsed = urlparse(presigned_url)
    query_params = parse_qs(parsed.query)
    
    required_params = ['X-Amz-Algorithm', 'X-Amz-Credential', 'X-Amz-Date', 'X-Amz-Signature']
    missing = [p for p in required_params if p not in query_params]
    
    if missing:
        return False, f"Paramètres manquants: {missing}"
    
    return True, "URL pré-signée valide"

def calculate_file_hash(file_path, algorithm='md5'):
    """Calculer le hash d'un fichier pour vérification d'intégrité"""
    hash_obj = hashlib.new(algorithm)
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    return hash_obj.hexdigest()

if __name__ == "__main__":
    # Test avec un fichier exemple
    test_file = "/tmp/test_s3_upload.txt"
    
    # Créer un fichier de test
    with open(test_file, 'w') as f:
        f.write("Test upload S3 pour Frame.io v4\nContenu de test\n")
    
    print("Script prêt pour test avec URL pré-signée Frame.io")
    print(f"Fichier de test créé: {test_file}")
    print("\nUtilisation:")
    print("from s3_upload_minimal import upload_to_s3_presigned")
    print("success, response, details = upload_to_s3_presigned('/path/to/file', 'https://s3-url')")
