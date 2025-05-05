// src/components/ Acheteur/Dashboard.jsx
//dashboard acheteur
import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      alert('Erreur lors de la déconnexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }
  
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  }

  // Charger les données réelles depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les commandes récentes - essayer plusieurs routes possibles
        let ordersData = [];
        try {
          // Essayer d'abord avec la route acheteur/orders
          const ordersResponse = await apiClient.get('/api/acheteur/orders');
          if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
            ordersData = ordersResponse.data;
          }
        } catch (orderError) {
          console.log('Erreur avec la première route, essai avec une autre route');
          try {
            // Essayer ensuite avec la route panier/orders
            const ordersResponse = await apiClient.get('/api/panier/orders');
            if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
              ordersData = ordersResponse.data;
            }
          } catch (secondError) {
            console.log('Erreur avec la deuxième route aussi');
          }
        }
        
        setRecentOrders(ordersData.slice(0, 3)); // Limiter aux 3 plus récentes
        
        // Pour la liste de souhaits et les avis, utiliser des valeurs par défaut
        // car ces routes ne semblent pas exister dans le backend
        setWishlistCount(0);
        setReviewsCount(0);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, utiliser des données par défaut
        setRecentOrders([]);
        setWishlistCount(0);
        setReviewsCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Mon profil</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div className="avatar bg-light rounded-circle p-3 mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1 text-primary">{currentUser.prenom.charAt(0)}{currentUser.nom.charAt(0)}</span>
                </div>
                <h5>{currentUser.prenom} {currentUser.nom}</h5>
                <p className="text-muted">{currentUser.email}</p>
              </div>
              <div className="list-group">
                <Link to="/acheteur/dashboard" className="list-group-item list-group-item-action active">
                  <i className="bi bi-speedometer2 me-2"></i>Tableau de bord
                </Link>
                <Link to="/acheteur/profile" className="list-group-item list-group-item-action">
                  <i className="bi bi-person me-2"></i>Éditer le profil
                </Link>
                <Link to="/acheteur/orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-bag me-2"></i>Mes commandes
                </Link>
                <Link to="/acheteur/wishlist" className="list-group-item list-group-item-action">
                  <i className="bi bi-heart me-2"></i>Liste de souhaits
                </Link>
                <Link to="/acheteur/addresses" className="list-group-item list-group-item-action">
                  <i className="bi bi-geo-alt me-2"></i>Mes adresses
                </Link>
                <div className='nav-item mt-4'>
                  <button
                    onClick={handleLogout}
                    className='nav-link text-danger border-0 bg-transparent d-flex align-items-center'
                  >
                    <i className='bi bi-box-arrow-right me-2'></i>
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">Tableau de bord</h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Bienvenue dans votre espace personnel, {currentUser.prenom}!
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="bi bi-bag-check fs-1 text-primary mb-2"></i>
                      <h5>Commandes</h5>
                      <h3>{recentOrders.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="bi bi-heart fs-1 text-success mb-2"></i>
                      <h5>Liste de souhaits</h5>
                      <h3>{wishlistCount}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <i className="bi bi-star fs-1 text-warning mb-2"></i>
                      <h5>Avis</h5>
                      <h3>{reviewsCount}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Commandes récentes</h5>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Commande #</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.date_commande || order.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              order.statut === 'livree' ? 'bg-success' : 
                              order.statut === 'expediee' ? 'bg-primary' : 
                              order.statut === 'validee' ? 'bg-info' : 
                              order.statut === 'annulee' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {order.statut === 'en_attente' ? 'En attente' :
                               order.statut === 'validee' ? 'Validée' :
                               order.statut === 'en_preparation' ? 'En préparation' :
                               order.statut === 'expediee' ? 'Expédiée' :
                               order.statut === 'livree' ? 'Livrée' :
                               order.statut === 'annulee' ? 'Annulée' : order.statut}
                            </span>
                          </td>
                          <td>{order.montant_total} FCFA</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => viewOrderDetails(order)}
                              >
                                Voir détails
                              </Button>
                              <Link 
                                to={`/acheteur/orders/${order.id}/invoice`} 
                                state={{ orderData: order }} 
                                className="btn btn-sm btn-outline-secondary"
                              >
                                Facture
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-end">
                    <Link to="/acheteur/orders" className="btn btn-outline-primary">
                      Voir toutes les commandes
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal pour afficher les détails d'une commande */}
      <Modal
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Date de commande:</strong> {new Date(selectedOrder.date_commande || selectedOrder.created_at).toLocaleDateString()}</p>
                  <p><strong>Statut:</strong> 
                    <Badge className="ms-2" bg={
                      selectedOrder.statut === 'livree' ? 'success' : 
                      selectedOrder.statut === 'expediee' ? 'primary' : 
                      selectedOrder.statut === 'validee' ? 'info' : 
                      selectedOrder.statut === 'annulee' ? 'danger' : 'warning'
                    }>
                      {selectedOrder.statut === 'en_attente' ? 'En attente' :
                       selectedOrder.statut === 'validee' ? 'Validée' :
                       selectedOrder.statut === 'en_preparation' ? 'En préparation' :
                       selectedOrder.statut === 'expediee' ? 'Expédiée' :
                       selectedOrder.statut === 'livree' ? 'Livrée' :
                       selectedOrder.statut === 'annulee' ? 'Annulée' : selectedOrder.statut}
                    </Badge>
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p><strong>Montant total:</strong> {selectedOrder.montant_total} FCFA</p>
                  <p><strong>Adresse de livraison:</strong> {selectedOrder.adresse_livraison}</p>
                </div>
              </div>

              <h6 className="mb-3">Articles commandés</h6>
              {selectedOrder.lignes && selectedOrder.lignes.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.lignes.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.produit?.nom || 'Produit non disponible'}</td>
                        <td>{ligne.quantite}</td>
                        <td>{ligne.prix_unitaire} FCFA</td>
                        <td>{ligne.prix_unitaire * ligne.quantite} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucun détail d'article disponible pour cette commande.</Alert>
              )}

              {selectedOrder.notes && (
                <div className="mt-3">
                  <h6>Notes:</h6>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.statut === 'en_attente' && (
                <div className="mt-3">
                  <Alert variant="warning">
                    <strong>Paiement requis</strong> - Cette commande est en attente de paiement.
                  </Alert>
                  <div className="d-flex justify-content-end mt-2">
                    <Link to={`/acheteur/orders/${selectedOrder.id}/payment`} className="btn btn-success">
                      Procéder au paiement
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderDetails(false)}>
            Fermer
          </Button>
          {selectedOrder && (
            <>
              <Link 
                to={`/acheteur/orders/${selectedOrder.id}/invoice`} 
                state={{ orderData: selectedOrder }}
                className="btn btn-outline-secondary me-2"
              >
                Voir la facture
              </Link>
              <Link to={`/acheteur/orders/${selectedOrder.id}`} className="btn btn-primary">
                Voir la page complète
              </Link>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;