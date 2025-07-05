"""Tests unitaires des intégrations PostFlow."""

import pytest
from unittest.mock import Mock, patch

from src.integrations.frameio import FrameIOClient
from src.integrations.google_sheets import GoogleSheetsClient
from src.integrations.discord import DiscordNotifier


class TestFrameIOIntegration:
    """Tests de l'intégration Frame.io."""
    
    @patch('src.integrations.frameio.requests')
    def test_frameio_auth(self, mock_requests):
        """Test d'authentification Frame.io."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'token': 'test_token'}
        mock_requests.post.return_value = mock_response
        
        config = {
            'api_token': 'test_token',
            'root_asset_id': 'root_id'
        }
        
        client = FrameIOClient(config)
        assert client.api_token == 'test_token'
    
    @patch('src.integrations.frameio.requests')
    def test_create_folder_structure(self, mock_requests):
        """Test de création de structure de dossiers."""
        mock_response = Mock()
        mock_response.status_code = 201
        mock_response.json.return_value = {'id': 'new_folder_id'}
        mock_requests.post.return_value = mock_response
        
        config = {
            'api_token': 'test_token',
            'root_asset_id': 'root_id'
        }
        
        client = FrameIOClient(config)
        folder_id = client.create_shot_folder_structure('UNDLM_12345')
        
        assert folder_id == 'new_folder_id'
        mock_requests.post.assert_called()
    
    @patch('src.integrations.frameio.requests')
    def test_upload_video(self, mock_requests):
        """Test d'upload vidéo."""
        # Mock de la réponse d'upload
        mock_response = Mock()
        mock_response.status_code = 201
        mock_response.json.return_value = {'id': 'uploaded_asset_id'}
        mock_requests.post.return_value = mock_response
        
        config = {
            'api_token': 'test_token',
            'root_asset_id': 'root_id'
        }
        
        client = FrameIOClient(config)
        
        # Créer un fichier temporaire pour le test
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.mov') as temp_file:
            temp_file.write(b'test video content')
            temp_file.flush()
            
            asset_id = client.upload_video(
                temp_file.name,
                'folder_id',
                {'name': 'test_video.mov'}
            )
        
        assert asset_id == 'uploaded_asset_id'


class TestGoogleSheetsIntegration:
    """Tests de l'intégration Google Sheets."""
    
    @patch('src.integrations.google_sheets.gspread')
    def test_sheets_auth(self, mock_gspread):
        """Test d'authentification Google Sheets."""
        mock_client = Mock()
        mock_gspread.service_account.return_value = mock_client
        
        config = {
            'service_account_file': 'credentials.json',
            'spreadsheet_id': 'sheet_id'
        }
        
        client = GoogleSheetsClient(config)
        assert client.spreadsheet_id == 'sheet_id'
        # Le test ne vérifie que les attributs, pas l'authentification réelle
    
    @patch('src.integrations.google_sheets.gspread')
    def test_update_shot_status(self, mock_gspread):
        """Test de mise à jour du statut de shot."""
        mock_client = Mock()
        mock_sheet = Mock()
        mock_worksheet = Mock()
        
        # Mock les méthodes de recherche
        mock_worksheet.get_all_values.return_value = [
            ['UNDLM_12345', 'Scene 1', 'Description', 'Pending', 'VFX', '50', '2024-01-01']
        ]
        mock_worksheet.find.return_value = Mock(row=1, col=1)
        mock_worksheet.update.return_value = True
        
        mock_gspread.service_account.return_value = mock_client
        mock_client.open_by_key.return_value = mock_sheet
        mock_sheet.worksheet.return_value = mock_worksheet
        
        config = {
            'service_account_file': 'credentials.json',
            'spreadsheet_id': 'sheet_id'
        }
        
        client = GoogleSheetsClient(config)
        # Mock la connexion établie
        client.client = mock_client
        client.spreadsheet = mock_sheet
        client.worksheet = mock_worksheet
        
        result = client.update_shot_status(
            'UNDLM_12345',
            'In Review',
            'VFX',
            75,
            'Updated via PostFlow'
        )
        
        assert result is True
        mock_worksheet.update.assert_called()


class TestDiscordIntegration:
    """Tests de l'intégration Discord."""
    
    @patch('src.integrations.discord.requests')
    def test_discord_send_message(self, mock_requests):
        """Test d'envoi de message Discord."""
        mock_response = Mock()
        mock_response.status_code = 204
        mock_requests.post.return_value = mock_response
        
        config = {
            'webhook_url': 'https://discord.com/api/webhooks/test'
        }
        
        notifier = DiscordNotifier(config)
        result = notifier.send_message('Test message')
        
        assert result is True
        mock_requests.post.assert_called()
    
    @patch('src.integrations.discord.requests')
    def test_discord_send_embed(self, mock_requests):
        """Test d'envoi d'embed Discord."""
        mock_response = Mock()
        mock_response.status_code = 204
        mock_requests.post.return_value = mock_response
        
        config = {
            'webhook_url': 'https://discord.com/api/webhooks/test'
        }
        
        notifier = DiscordNotifier(config)
        embed = {
            'title': 'New Render',
            'description': 'UNDLM_12345 v001 uploaded',
            'color': 0x00ff00
        }
        
        result = notifier.send_message('New render available!', embed=embed)
        
        assert result is True
        mock_requests.post.assert_called()
        
        # Vérifier que l'embed est inclus dans la requête
        call_args = mock_requests.post.call_args
        json_data = call_args[1]['json']
        assert 'embeds' in json_data
        assert json_data['embeds'][0]['title'] == 'New Render'
    
    @patch('src.integrations.discord.requests')
    def test_discord_error_handling(self, mock_requests):
        """Test de gestion d'erreur Discord."""
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.text = 'Bad Request'
        mock_response.raise_for_status.side_effect = Exception("HTTP 400 Bad Request")
        mock_requests.post.return_value = mock_response
        
        config = {
            'webhook_url': 'https://discord.com/api/webhooks/test'
        }
        
        notifier = DiscordNotifier(config)
        
        # Le message devrait échouer et retourner False
        result = notifier.send_message('Test message')
        assert result is False
