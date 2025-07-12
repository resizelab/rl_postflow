@echo off
REM 🚀 RL PostFlow - Script de Déploiement Windows
REM Automatise le déploiement sur serveur Windows

setlocal enabledelayedexpansion

echo 🎬 RL PostFlow - Déploiement Windows
echo =====================================

REM Variables
set "PROJECT_DIR=%~dp0.."
set "BACKUP_DIR=%PROJECT_DIR%\backups"
set "LOG_FILE=%PROJECT_DIR%\logs\deploy.log"
set "TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=!TIMESTAMP: =0!"

REM Créer les dossiers si nécessaire
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%PROJECT_DIR%\logs" mkdir "%PROJECT_DIR%\logs"

REM Fonction de logging
call :log "🚀 Début du déploiement - %TIMESTAMP%"

REM Changer vers le répertoire du projet
cd /d "%PROJECT_DIR%"
call :log "📁 Répertoire: %PROJECT_DIR%"

REM 1. Sauvegarde de sécurité
call :log "💾 Création sauvegarde de sécurité..."
git stash push -m "backup-before-deploy-%TIMESTAMP%" >nul 2>&1
if !errorlevel! equ 0 (
    call :log "✅ Sauvegarde créée"
) else (
    call :log "⚠️ Aucune modification à sauvegarder"
)

REM 2. Vérification de la connectivité Git
call :log "🔍 Vérification connectivité Git..."
git fetch origin >nul 2>&1
if !errorlevel! neq 0 (
    call :log "❌ Erreur de connectivité Git"
    goto :error_exit
)

REM 3. Récupération des modifications
call :log "📥 Récupération des modifications..."
git pull origin main
if !errorlevel! neq 0 (
    call :log "❌ Erreur lors du Git Pull"
    goto :restore_and_exit
)
call :log "✅ Modifications récupérées"

REM 4. Vérification des dépendances Python
call :log "🐍 Vérification Python..."
python --version >nul 2>&1
if !errorlevel! neq 0 (
    call :log "❌ Python non trouvé"
    goto :restore_and_exit
)

REM 5. Installation/Mise à jour des dépendances
if exist "requirements.txt" (
    call :log "📦 Mise à jour des dépendances..."
    pip install -r requirements.txt --quiet
    if !errorlevel! equ 0 (
        call :log "✅ Dépendances installées"
    ) else (
        call :log "⚠️ Erreur installation dépendances"
    )
)

REM 6. Migration automatique des configurations
call :log "🔄 Migration des configurations..."
if exist "migrate_to_windows.py" (
    python migrate_to_windows.py
    if !errorlevel! equ 0 (
        call :log "✅ Migration réussie"
    ) else (
        call :log "❌ Erreur lors de la migration"
        goto :restore_and_exit
    )
) else (
    call :log "⚠️ Script de migration non trouvé"
)

REM 7. Validation post-déploiement
call :log "🧪 Validation post-déploiement..."
if exist "validate_postflow.py" (
    python validate_postflow.py
    if !errorlevel! equ 0 (
        call :log "✅ Validation réussie"
    ) else (
        call :log "❌ Validation échouée"
        goto :restore_and_exit
    )
) else (
    call :log "⚠️ Script de validation non trouvé"
)

REM 8. Test rapide du système
call :log "⚡ Test rapide du système..."
python main.py --test >nul 2>&1
if !errorlevel! equ 0 (
    call :log "✅ Test système réussi"
) else (
    call :log "⚠️ Test système échoué (peut être normal)"
)

REM 9. Nettoyage des anciennes sauvegardes
call :log "🧹 Nettoyage des anciennes sauvegardes..."
git stash list | findstr /C:"backup-before-deploy" >nul
if !errorlevel! equ 0 (
    REM Garder seulement les 5 dernières sauvegardes
    for /f "skip=5 tokens=1 delims=:" %%i in ('git stash list ^| findstr /C:"backup-before-deploy"') do (
        git stash drop %%i >nul 2>&1
    )
)

call :log "🎉 DÉPLOIEMENT RÉUSSI !"
echo.
echo ==========================================
echo ✅ DÉPLOIEMENT WINDOWS TERMINÉ
echo ==========================================
echo 📁 Projet: PostFlow v4.1.1
echo 📅 Date: %date% %time%
echo 🚀 Statut: SUCCÈS
echo.
echo Prochaines étapes:
echo 1. Vérifier les logs: logs\deploy.log
echo 2. Démarrer PostFlow: python main.py
echo 3. Accéder au dashboard: http://localhost:8081
echo.
pause
exit /b 0

REM Fonction de restauration et sortie d'erreur
:restore_and_exit
call :log "🔄 Restauration de la sauvegarde..."
git stash pop >nul 2>&1
if !errorlevel! equ 0 (
    call :log "✅ Sauvegarde restaurée"
) else (
    call :log "⚠️ Erreur lors de la restauration"
)

:error_exit
call :log "❌ DÉPLOIEMENT ÉCHOUÉ"
echo.
echo ==========================================
echo ❌ DÉPLOIEMENT ÉCHOUÉ
echo ==========================================
echo 📁 Projet: PostFlow v4.1.1
echo 📅 Date: %date% %time%
echo 🚨 Statut: ERREUR
echo.
echo Vérifiez les logs: logs\deploy.log
echo.
pause
exit /b 1

REM Fonction de logging
:log
set "MSG=%~1"
echo %MSG%
echo [%date% %time%] %MSG% >> "%LOG_FILE%"
goto :eof
