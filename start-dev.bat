@echo off
REM Lancer Laravel
start cmd /k "cd backend && php artisan serve"

REM Lancer ngrok (un seul tunnel vers Laravel)
start cmd /k "ngrok http 8000"

REM Attendre 3 secondes pour laisser ngrok démarrer
timeout /t 3 > nul

REM Lancer le script Node pour mettre à jour l’URL dans React
cd frontend
node update-env.cjs

REM Lancer React
npm run dev
