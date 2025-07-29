import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { apiClient } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const PaymentForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('mtn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (paymentMethod === 'mobile_money') {
        console.log('Envoi de la demande de paiement Mobile Money', {
          commande_id: orderId,
          numero_telephone: phoneNumber,
          operator: operator
        });
        response = await apiClient.post('/payment/mobile-money', {
          commande_id: orderId,
          numero_telephone: phoneNumber,
          operator: operator
        });
      } else if (paymentMethod === 'orange_money') {
        console.log('Envoi de la demande de paiement Orange Money', {
          commande_id: orderId,
          numero_telephone: phoneNumber
        });
        response = await apiClient.post('/payment/orange-money', {
          commande_id: orderId,
          numero_telephone: phoneNumber
        });
      }

      setSuccess(true);
      setLoading(false);
      
      // Rediriger vers la liste des commandes après 3 secondes
      setTimeout(() => {
        navigate('/acheteur/orders');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors du paiement');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/acheteur/orders');
  };

  if (success) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <Card className="p-4 mb-4">
            <Alert variant="success">
              <Alert.Heading>Paiement réussi!</Alert.Heading>
              <p>
                Votre commande a été payée avec succès. Vous recevrez une confirmation par email.
              </p>
              <Button variant="outline-success" onClick={() => navigate('/acheteur/orders')}>
                Retour à mes commandes
              </Button>
            </Alert>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <Card className="p-4 mb-4">
              <Card.Title>Paiement de la commande #{orderId}</Card.Title>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Méthode de paiement</Form.Label>
                  <Form.Select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="mobile_money">Mobile Money (MTN)</option>
                    <option value="orange_money">Orange Money</option>
                  </Form.Select>
                </Form.Group>
                
                {paymentMethod === 'mobile_money' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Opérateur</Form.Label>
                    <Form.Select 
                      value={operator} 
                      onChange={(e) => setOperator(e.target.value)}
                    >
                      <option value="mtn">MTN Money</option>
                      
                    </Form.Select>
                  </Form.Group>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Numéro de téléphone</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ex: 697453221" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Entrez le numéro associé à votre compte {paymentMethod === 'mobile_money' ? operator : 'Orange'} Money
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Traitement...</span>
                      </>
                    ) : (
                      'Payer maintenant'
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentForm;
