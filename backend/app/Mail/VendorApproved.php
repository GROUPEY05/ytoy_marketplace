<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VendorApproved extends Mailable
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
        return $this->subject('Votre compte vendeur a été approuvé')
                    ->view('emails.vendor_approved')
                    ->with([
                        'vendorName' => $this->vendor->nom,
                        'vendorEmail' => $this->vendor->email,
                    ]);
    }
}
