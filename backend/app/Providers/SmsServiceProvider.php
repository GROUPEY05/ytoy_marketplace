<?php

// app/Providers/SmsServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Twilio\Rest\Client;

class SmsServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('twilio', function () {
            $sid = config('services.twilio.sid');
            $token = config('services.twilio.token');
            return new Client($sid, $token);
        });
    }
}