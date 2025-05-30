import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { apiClient } from '../../services/api';
import PaymentForm from '../payment/PaymentForm';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderToPay, setOrderToPay] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      // Utiliser l'URL correcte avec le préfixe API et s'assurer que le token est envoyé
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour voir vos commandes');
        setLoading(false);
        return;
      }
      
      // Essayer plusieurs routes possibles pour récupérer les commandes
      let success = false;
      
      try {
        // Première tentative avec la route pour les acheteurs
        const response = await apiClient.get('/api/acheteur/orders');
        setOrders(response.data);
        success = true;
      } catch (firstError) {
        console.log('Premier endpoint a échoué, essai avec un autre endpoint');
        
        try {
          // Deuxième tentative avec une autre route
          const response = await apiClient.get('/api/orders');
          setOrders(response.data);
          success = true;
        } catch (secondError) {
          try {
            // Si les deux tentatives échouent, essayer une troisième route
            const response = await apiClient.get('/api/panier/orders');
            setOrders(response.data);
            success = true;
          } catch (thirdError) {
            // Toutes les tentatives ont échoué
            throw new Error('Impossible de récupérer les commandes');
          }
        }
      }
      
      if (success) {
        setError('');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes', err);
      setError('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (statut) => {
    const variants = {
      'en_attente': 'warning',
      'validee': 'info',
      'en_preparation': 'info',
      'expediee': 'primary',
      'livree': 'success',
      'annulee': 'danger'
    };
    
    const labels = {
      'en_attente': 'En attente',
      'validee': 'Validée',
      'en_preparation': 'En préparation',
      'expediee': 'Expédiée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };

    return (
      <Badge bg={variants[statut] || 'secondary'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  const viewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };
  
  const handlePayment = (order) => {
    setOrderToPay(order);
    setShowPaymentForm(true);
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    fetchOrders(); // Rafraîchir la liste des commandes
    alert('Paiement effectué avec succès!');
  };
  
  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  const Invoice = ({ order }) => (
    <div className="p-4">
      <h4 className="text-center mb-4">Facture</h4>
      <div className="mb-4">
        <p><strong>N° de commande:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Statut:</strong> {getStatusBadge(order.status)}</p>
      </div>

      <Table bordered>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.id}>
              <td>{item.product.title}</td>
              <td>{item.quantity}</td>
              <td>{item.price} FCFA</td>
              <td>{item.price * item.quantity} FCFA</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end"><strong>Total</strong></td>
            <td><strong>{order.total} FCFA</strong></td>
          </tr>
        </tfoot>
      </Table>

      <div className="mt-4">
        <p><strong>Adresse de livraison:</strong></p>
        <p>{order.shipping_address}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Historique des commandes</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">
          Vous n'avez pas encore passé de commande.
        </Alert>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>N° de commande</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.date_commande || order.created_at).toLocaleDateString()}</td>
                <td>{getStatusBadge(order.statut)}</td>
                <td>{order.montant_total} FCFA</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => viewInvoice(order)}
                    >
                      Voir la facture
                    </Button>
                    
                    {order.statut === 'en_attente' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handlePayment(order)}
                      >
                        Payer
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        show={showInvoice}
        onHide={() => setShowInvoice(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Facture - Commande #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && <Invoice order={selectedOrder} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoice(false)}>
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={() => window.print()}
          >
            Imprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour le paiement */}
      <Modal
        show={showPaymentForm}
        onHide={handlePaymentCancel}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Paiement de la commande #{orderToPay?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToPay ? (
            <PaymentForm
              orderId={orderToPay.id}
              amount={orderToPay.montant_total}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <Alert variant="warning">
              Aucune commande sélectionnée pour le paiement.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePaymentCancel}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderHistory;
