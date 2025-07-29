import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await apiClient.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Impossible de charger les détails de la commande');
      }
    };

    fetchOrder();
  }, [orderId]);

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Erreur</h3>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Chargement...</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="text-center">
        <Card.Body>
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <Card.Title as="h2" className="mb-4">
            Merci pour votre commande !
          </Card.Title>
          <Card.Text>
            Votre commande #{orderId} a été confirmée et est en cours de traitement.
          </Card.Text>
          <Card.Text>
            Un email de confirmation a été envoyé à {order.email}.
          </Card.Text>
          <div className="mt-4">
            <h4>Détails de la commande</h4>
            <p>Total payé : {order.total} FCFA</p>
            <p>Méthode de paiement : {order.payment_method}</p>
            {location.state?.paymentData?.transaction_id && (
              <p>ID de transaction : {location.state.paymentData.transaction_id}</p>
            )}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => navigate('/orders')}
              style={{
                backgroundColor: '#F98B3A',
                border: 'none',
                marginRight: '10px'
              }}
            >
              Voir mes commandes
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/')}
            >
              Continuer les achats
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderConfirmationPage;
