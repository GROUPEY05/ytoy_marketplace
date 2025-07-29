import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import PaymentForm from '../payment/PaymentForm';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const OrderPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/acheteur/orders/${orderId}`);
        setOrder(response.data);
        setError('');
      } catch (err) {
        console.error('Erreur lors du chargement de la commande', err);
        setError('Impossible de charger les détails de la commande. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePaymentSuccess = () => {
    alert('Paiement effectué avec succès!');
    navigate('/acheteur/orders');
  };

  const handlePaymentCancel = () => {
    navigate('/acheteur/orders');
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="my-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="my-5">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/acheteur/orders')}>
            Retour aux commandes
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <Container className="my-5">
          <Alert variant="warning">Commande non trouvée.</Alert>
          <Button variant="primary" onClick={() => navigate('/acheteur/orders')}>
            Retour aux commandes
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="my-5">
        <h2 className="mb-4">Paiement de la commande #{orderId}</h2>
        
        <Card className="mb-4">
          <Card.Header>
            <h5>Détails de la commande</h5>
          </Card.Header>
          <Card.Body>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> {order.statut}</p>
            <p><strong>Montant total:</strong> {order.montant_total} FCFA</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header>
            <h5>Formulaire de paiement</h5>
          </Card.Header>
          <Card.Body>
            <PaymentForm
              orderId={order.id}
              amount={order.montant_total}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Card.Body>
        </Card>
        
        <div className="mt-4">
          <Button variant="secondary" onClick={handlePaymentCancel}>
            Annuler et retourner aux commandes
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default OrderPayment;