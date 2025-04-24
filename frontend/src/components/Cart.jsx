import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  
  // Calculer les totaux
  const subtotal = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  useEffect(() => {
    // Récupérer les articles du panier depuis localStorage ou API
    const fetchCartItems = () => {
      try {
        // Option 1: Récupérer depuis localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        
        // Option 2: Si vous avez une API pour le panier utilisateur
        // if (isAuthenticated) {
        //   const response = await authService.getCart();
        //   setCartItems(response.data);
        // }
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        setError('Impossible de charger votre panier. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantite: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Si vous avez une API
    // if (isAuthenticated) {
    //   authService.updateCartItem(productId, newQuantity);
    // }
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Si vous avez une API
    // if (isAuthenticated) {
    //   authService.removeFromCart(productId);
    // }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Si vous avez une API
    // if (isAuthenticated) {
    //   authService.clearCart();
    // }
  };

  const applyCoupon = () => {
    // Simuler la validation d'un code promo
    if (couponCode === 'PROMO10') {
      setDiscountApplied(true);
      setError('');
    } else {
      setError('Code promo invalide');
      setDiscountApplied(false);
    }
  };

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart', message: 'Veuillez vous connecter pour finaliser votre commande' } });
      return;
    }
    
    // Redirection vers la page de paiement
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
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