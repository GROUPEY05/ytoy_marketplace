<?php
use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::raw('Ceci est un mail de test.', function ($message) {
        $message->to('test@example.com')
                ->subject('Test Mailtrap');
    });


    return 'Mail envoyé avec succès !';
});

Route::get('/', function () {
    return 'Bienvenue sur l’API Laravel via Ngrok !';
});
