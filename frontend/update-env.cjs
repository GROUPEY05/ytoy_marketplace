const fs = require("fs");
const http = require("http");

http.get("http://127.0.0.1:4040/api/tunnels", (res) => {
  let data = "";

  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    const tunnels = JSON.parse(data).tunnels;
    const backendTunnel = tunnels.find(t => t.name === 'command_line');

    if (!backendTunnel) {
      console.error("❌ Tunnel non trouvé");
      return;
    }

    const apiUrl = backendTunnel.public_url;
    const envPath = "./.env";

    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(/VITE_API_URL=.*/, `VITE_API_URL=${apiUrl}`);
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ API URL mise à jour : ${apiUrl}`);
  });
});