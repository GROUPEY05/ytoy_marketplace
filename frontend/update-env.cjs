const fs = require('fs');
const path = require('path');

// Lire le fichier backend-url.json
const raw = fs.readFileSync('../backend/backend-url.json', 'utf8');
const json = JSON.parse(raw);

// Extraire l'URL publique du backend (port 8000)
const backendTunnel = json.tunnels.find(t => t.config.addr.includes('8000'));
const backendUrl = backendTunnel ? backendTunnel.public_url : null;

if (!backendUrl) {
  console.error("❌ Impossible de trouver l'URL du backend.");
  process.exit(1);
}

// Mettre à jour .env
const envPath = path.join(__dirname, '.env');
let env = fs.readFileSync(envPath, 'utf8');

// Remplace ou ajoute VITE_API_URL
if (env.includes('VITE_API_URL=')) {
  env = env.replace(/VITE_API_URL=.*/g, `VITE_API_URL=${backendUrl}`);
} else {
  env += `\nVITE_API_URL=${backendUrl}`;
}

fs.writeFileSync(envPath, env);
console.log(`✅ .env mis à jour avec : VITE_API_URL=${backendUrl}`);
