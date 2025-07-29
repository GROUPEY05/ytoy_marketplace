import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Alert, Form } from 'react-bootstrap';
import { apiClient } from '../../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { data } = await apiClient.post('/payments/create-payment-intent', {
        order_id: orderId,
      });

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        type="submit"
        disabled={!stripe || processing}
        style={{
          backgroundColor: '#F98B3A',
          border: 'none',
          width: '100%',
        }}
      >
        {processing ? 'Traitement...' : 'Payer maintenant'}
      </Button>
    </Form>
  );
};

const StripePayment = ({ orderId, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="p-4 border rounded">
        <h4 className="mb-4">Paiement par carte</h4>
        <CheckoutForm orderId={orderId} onSuccess={onSuccess} />
      </div>
    </Elements>
  );
};

export default StripePayment;
