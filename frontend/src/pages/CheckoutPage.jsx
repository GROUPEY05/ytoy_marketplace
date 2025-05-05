import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import StripePayment from '../components/payment/StripePayment';
import OrangeMoneyPayment from '../components/payment/OrangeMoneyPayment';
import MobileMoneyPayment from '../components/payment/MobileMoneyPayment';
import { apiClient } from '../services/api';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await apiClient.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Impossible de charger les détails de la commande');
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePaymentSuccess = (paymentData) => {
    // Rediriger vers la page de confirmation
    navigate(`/order-confirmation/${orderId}`, {
      state: { paymentData }
    });
  };

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
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h3 className="mb-4">Choisissez votre mode de paiement</h3>
              <Tabs
                defaultActiveKey="card"
                className="mb-4"
              >
                <Tab eventKey="card" title="Carte bancaire">
                  <div className="py-3">
                    <StripePayment
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                </Tab>
                <Tab eventKey="orange" title="Orange Money">
                  <div className="py-3">
                    <OrangeMoneyPayment
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                </Tab>
                <Tab eventKey="mobile" title="Mobile Money">
                  <div className="py-3">
                    <MobileMoneyPayment
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Résumé de la commande</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total</span>
                <span>{order.subtotal} FCFA</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Frais de livraison</span>
                <span>{order.shipping_cost} FCFA</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-0">
                <strong>Total</strong>
                <strong>{order.total} FCFA</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
