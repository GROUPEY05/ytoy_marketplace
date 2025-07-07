<?php

return [

    'paths' => ['*'], // Autoriser tous les chemins

    'allowed_methods' => ['*'], // Autorise toutes les méthodes (GET, POST, etc.)

    'allowed_origins' => ['*'], // Origines autorisées 'http://localhost:5173', 'http://127.0.0.1:5173'

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Autorise tous les en-têtes

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' =>  true, // Mettez à true si vous utilisez des cookies ou des sessions

];