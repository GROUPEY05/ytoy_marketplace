import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { apiClient } from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/orders');
      setOrders(response.data);
      setError('');
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

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    
    const labels = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'shipped': 'Expédié',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    };

    return (
      <Badge bg={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const viewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
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
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{order.total} FCFA</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => viewInvoice(order)}
                  >
                    Voir la facture
                  </Button>
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
    </Container>
  );
};

export default OrderHistory;
