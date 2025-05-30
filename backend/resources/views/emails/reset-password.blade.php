<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d3748;">Réinitialisation de mot de passe</h2>
        
        <p>Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
        
        <div style="margin: 30px 0;">
            <a href="{{ $resetUrl }}" 
               style="background-color: #3490dc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">
                Réinitialiser le mot de passe
            </a>
        </div>
        
        <p>Ce lien de réinitialisation expirera dans 60 minutes.</p>
        
        <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune action n'est requise.</p>
        
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
        
        <p style="color: #718096; font-size: 0.9em;">Si vous avez des problèmes pour cliquer sur le bouton "Réinitialiser le mot de passe", copiez et collez l'URL ci-dessous dans votre navigateur web : {{ $resetUrl }}</p>
    </div>
</body>
</html>
