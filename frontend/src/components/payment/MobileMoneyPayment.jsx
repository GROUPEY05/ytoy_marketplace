import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { apiClient } from '../../services/api';

const MobileMoneyPayment = ({ orderId, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('mtn');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const { data } = await apiClient.post('/api/payments/mobile-money', {
        order_id: orderId,
        phone_number: phoneNumber,
        operator: operator
      });

      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h4 className="mb-4">Paiement Mobile Money</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Opérateur</Form.Label>
          <Form.Select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            required
          >
            <option value="mtn">MTN Mobile Money</option>
            <option value="moov">Moov Money</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Numéro de téléphone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Ex: 07XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button
          type="submit"
          disabled={processing}
          style={{
            backgroundColor: '#F98B3A',
            border: 'none',
            width: '100%'
          }}
        >
          {processing ? 'Traitement...' : 'Payer maintenant'}
        </Button>

        <div className="mt-3 text-muted small">
          <p>Instructions :</p>
          <ol>
            <li>Entrez votre numéro de téléphone</li>
            <li>Cliquez sur "Payer maintenant"</li>
            <li>Vous recevrez un message pour confirmer le paiement</li>
            <li>Entrez votre code PIN pour valider</li>
          </ol>
        </div>
      </Form>
    </div>
  );
};

export default MobileMoneyPayment;
