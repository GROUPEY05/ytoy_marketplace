import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Calculer les totaux
  const subtotal = cartItems.reduce((sum, item) => sum + item.produit.prix * item.quantite, 0);
  const shipping = 1000; // Frais de livraison fixes en FCFA
  const total = subtotal + shipping;

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCartItems(response.data.items);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      setError('Impossible de charger votre panier. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/cart/update/${itemId}`, {
        quantite: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Mettre à jour l'affichage local
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantite: newQuantity } : item
      );
      setCartItems(updatedCart);

      // Mettre à jour le compteur du panier
      const cartCountEvent = new CustomEvent('cartUpdated', {
        detail: { count: updatedCart.reduce((sum, item) => sum + item.quantite, 0) }
      });
      window.dispatchEvent(cartCountEvent);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      setError('Erreur lors de la mise à jour de la quantité');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Mettre à jour l'affichage local
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);

      // Mettre à jour le compteur du panier
      const cartCountEvent = new CustomEvent('cartUpdated', {
        detail: { count: updatedCart.reduce((sum, item) => sum + item.quantite, 0) }
      });
      window.dispatchEvent(cartCountEvent);

      setMessage('Article supprimé du panier');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'article');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/cart/clear', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCartItems([]);
      
      // Mettre à jour le compteur du panier
      const cartCountEvent = new CustomEvent('cartUpdated', {
        detail: { count: 0 }
      });
      window.dispatchEvent(cartCountEvent);

      setMessage('Panier vidé');
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      setError('Erreur lors de la suppression du panier');
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (!user) {
    navigate('/login', { state: { from: '/cart' } });
    return null;
  }

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4" style={{ color: '#FF6F00' }}>Mon Panier</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {cartItems.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title className="mb-4">Votre panier est vide</Card.Title>
            <Card.Text>
              Vous n'avez aucun article dans votre panier actuellement.
            </Card.Text>
            <Button 
              as={Link} 
              to="/products" 
              variant="primary" 
              style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
            >
              Découvrir nos produits
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <Row className="text-muted">
                  <Col md={6}>Produit</Col>
                  <Col md={2} className="text-center">Prix</Col>
                  <Col md={2} className="text-center">Quantité</Col>
                  <Col md={2} className="text-center">Total</Col>
                </Row>
              </Card.Header>
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image || '/placeholder-product.jpg'} 
                            alt={item.nom} 
                            className="cart-item-image me-3" 
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                          />
                          <div>
                            <h6 className="mb-0">{item.nom}</h6>
                            <small className="text-muted">Vendeur: {item.vendeur || 'Ytoy Marketplace'}</small>
                            <div className="mt-2">
                              <Button 
                                variant="link" 
                                className="p-0 text-danger" 
                                onClick={() => removeItem(item.id)}
                              >
                                <i className="bi bi-trash me-1"></i> Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={2} className="text-center">
                        {item.prix.toFixed(2)} Francfa
                      </Col>
                      <Col md={2} className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantite - 1)}
                            disabled={item.quantite <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantite}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantite + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col md={2} className="text-center fw-bold">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearCart}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Vider le panier
                  </Button>
                  <Button 
                    as={Link} 
                    to="/products" 
                    variant="outline-primary"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Continuer mes achats
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Récapitulatif</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Frais de livraison</span>
                  <span>{shipping.toFixed(2)} €</span>
                </div>
                {discountApplied && (
                  <div className="d-flex justify-content-between mb-3 text-success">
                    <span>Réduction (10%)</span>
                    <span>-{discount.toFixed(2)} €</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong style={{ color: '#FF6F00' }}>{total.toFixed(2)} €</strong>
                </div>
                
                <Form className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Code promo</Form.Label>
                    <div className="d-flex">
                      <Form.Control 
                        type="text" 
                        placeholder="Entrez votre code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline-secondary" 
                        className="ms-2"
                        onClick={applyCoupon}
                      >
                        Appliquer
                      </Button>
                    </div>
                    {discountApplied && (
                      <Form.Text className="text-success">
                        Code promo appliqué avec succès !
                      </Form.Text>
                    )}
                  </Form.Group>
                </Form>
                
                <Button 
                  variant="primary" 
                  className="w-100 py-2" 
                  style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
                  onClick={proceedToCheckout}
                >
                  Procéder au paiement
                </Button>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
                <h6>Nous acceptons</h6>
                <div className="d-flex gap-2 mb-3">
                  <i className="bi bi-credit-card fs-4"></i>
                  <i className="bi bi-paypal fs-4"></i>
                  <i className="bi bi-wallet2 fs-4"></i>
                </div>
                <small className="text-muted">
                  Paiement 100% sécurisé avec cryptage SSL
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;