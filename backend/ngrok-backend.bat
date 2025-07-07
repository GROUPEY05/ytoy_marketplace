@echo off
start "" "C:\Program Files\ngrok-v3-stable-windows-amd64\ngrok.exe" http 8000
timeout /t 3 > nul
curl http://127.0.0.1:4040/api/tunnels > backend-url.json
echo ✅ Ngrok lancé pour le backend (port 8000)
echo 🌍 Fichier backend-url.json généré.
pause