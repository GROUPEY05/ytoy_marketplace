import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Badge, Pagination, Form, InputGroup, Row, Col, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // État pour le modal de détails de commande
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // État pour la mise à jour du statut
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async (page = 1, search = searchTerm, status = filterStatus) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vendor/orders', {
        params: {
          page,
          search,
          status,
          per_page: pagination.perPage,
        },
      });
      
      setOrders(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1, searchTerm, filterStatus);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    fetchOrders(1, searchTerm, status);
  };

  // Afficher les détails d'une commande
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Afficher le modal de mise à jour du statut
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setStatusUpdateLoading(true);
      
      await axios.put(`/api/vendor/orders/${selectedOrder.id}/status`, {
        status: newStatus
      });
      
      // Mettre à jour l'état local
      const updatedOrders = orders.map(order => {
        if (order.id === selectedOrder.id) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setShowStatusModal(false);
      setSelectedOrder(null);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut. Veuillez réessayer plus tard.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Statuts possibles pour les commandes
  const orderStatusOptions = [
    { value: 'pending', label: 'En attente', variant: 'warning' },
    { value: 'processing', label: 'En traitement', variant: 'info' },
    { value: 'shipped', label: 'Expédiée', variant: 'primary' },
    { value: 'delivered', label: 'Livrée', variant: 'success' },
    { value: 'cancelled', label: 'Annulée', variant: 'danger' },
  ];

  // Obtenir l'objet de statut complet
  const getStatusObject = (statusValue) => {
    return orderStatusOptions.find(option => option.value === statusValue) || 
      { value: statusValue, label: statusValue, variant: 'secondary' };
  };

  // Formater le prix
  const formatPrice = (price) => {
    return Number(price).toFixed(2) + ' €';
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer les éléments de pagination
  const paginationItems = [];
  for (let page = 1; page <= pagination.lastPage; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === pagination.currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h2>Gestion des commandes</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Filtres */}
          <Row className="mb-4">
            <Col md={4}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par numéro ou client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button 
                    variant="outline-secondary" 
                    type="submit"
                  >
                    Rechercher
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="">Tous les statuts</option>
                {orderStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4} className="text-md-end text-start mt-3 mt-md-0">
              <span className="text-muted">
                {pagination.total} commande{pagination.total > 1 ? 's' : ''} au total
              </span>
            </Col>
          </Row>

          {/* Tableau des commandes */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Commande</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Articles</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = getStatusObject(order.status);
                    return (
                      <tr key={order.id}>
                        <td>#{order.order_number}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.customer_name}</td>
                        <td>{formatPrice(order.total_amount)}</td>
                        <td>{order.item_count} article(s)</td>
                        <td>
                          <Badge bg={status.variant}>
                            {status.label}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary"
                              size="sm"
                              onClick={() => viewOrderDetails(order)}
                            >
                              Détails
                            </Button>
                            <Button 
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => openStatusModal(order)}
                            >
                              Statut
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev 
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                />
                
                {paginationItems}
                
                <Pagination.Next 
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => handlePageChange(pagination.lastPage)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal des détails de commande */}
      <Modal
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Détails de la commande #{selectedOrder?.order_number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Informations client</h5>
                  <p className="mb-1"><strong>Nom:</strong> {selectedOrder.customer_name}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p className="mb-1"><strong>Téléphone:</strong> {selectedOrder.customer_phone || 'Non spécifié'}</p>
                </Col>
                <Col md={6}>
                  <h5>Informations commande</h5>
                  <p className="mb-1"><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p className="mb-1">
                    <strong>Statut:</strong>{' '}
                    <Badge bg={getStatusObject(selectedOrder.status).variant}>
                      {getStatusObject(selectedOrder.status).label}
                    </Badge>
                  </p>
                  <p className="mb-1"><strong>Total:</strong> {formatPrice(selectedOrder.total_amount)}</p>
                </Col>
              </Row>

              <h5>Adresse de livraison</h5>
              <p>
                {selectedOrder.shipping_address?.address_line_1}<br />
                {selectedOrder.shipping_address?.address_line_2 && (
                  <>{selectedOrder.shipping_address.address_line_2}<br /></>
                )}
                {selectedOrder.shipping_address?.postal_code} {selectedOrder.shipping_address?.city}<br />
                {selectedOrder.shipping_address?.country}
              </p>

              <h5 className="mt-4">Articles commandés</h5>
              <Table bordered responsive>
                <thead className="table-light">
                  <tr>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.product_image && (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                              className="border"
                            />
                          )}
                          <div>
                            {item.product_name}
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.unit_price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.unit_price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Sous-total</strong></td>
                    <td>{formatPrice(selectedOrder.subtotal)}</td>
                  </tr>
                  {selectedOrder.shipping_cost > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Frais de livraison</strong></td>
                      <td>{formatPrice(selectedOrder.shipping_cost)}</td>
                    </tr>
                  )}
                  {selectedOrder.tax > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end"><strong>TVA</strong></td>
                      <td>{formatPrice(selectedOrder.tax)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total</strong></td>
                    <td><strong>{formatPrice(selectedOrder.total_amount)}</strong></td>
                  </tr>
                </tfoot>
              </Table>

              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowOrderDetails(false)}
                >
                  Fermer
                </Button>
                <Link 
                  to={`/dashboard/invoices/${selectedOrder.invoice_id}`} 
                  className="btn btn-outline-primary"
                >
                  Voir la facture
                </Link>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de mise à jour du statut */}
      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Mettre à jour le statut de la commande #{selectedOrder?.order_number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nouveau statut</Form.Label>
            <Form.Select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {orderStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            onClick={() => setShowStatusModal(false)}
          >
            Annuler
          </Button>
          <Button 
            style={{ backgroundColor: '#FF6600', borderColor: '#FF6600' }}
            onClick={updateOrderStatus}
            disabled={statusUpdateLoading}
          >
            {statusUpdateLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;