<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VendorRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $vendor;

    /**
     * Crée une nouvelle instance du Mailable.
     *
     * @param $vendor
     */
    public function __construct($vendor)
    {
        $this->vendor = $vendor;
    }

    /**
     * Construit le message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Votre demande de compte vendeur a été rejetée')
                    ->view('emails.vendor_rejected')
                    ->with([
                        'vendorName' => $this->vendor->nom,
                        'vendorEmail' => $this->vendor->email,
                    ]);
    }
}
