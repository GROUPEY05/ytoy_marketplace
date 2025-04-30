<?php

return [

    'paths' => ['api/*', 'produits/*', 'cart/*'], // Ajoutez les chemins nécessaires

    'allowed_methods' => ['*'], // Autorise toutes les méthodes (GET, POST, etc.)

    'allowed_origins' => ['http://localhost:5173'], // Origine autorisée

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Autorise tous les en-têtes

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' =>  true, // Mettez à true si vous utilisez des cookies ou des sessions

];
