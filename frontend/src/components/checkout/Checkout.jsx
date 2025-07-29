import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

// Simulons des articles dans le panier (à remplacer par les données réelles du panier)
const dummyCartItems = [
  { id: 1, name: 'Produit 1', price: 19.99, quantity: 2, image: '/placeholder/100/100' },
  { id: 3, name: 'Produit 3', price: 39.99, quantity: 1, image: '/placeholder/100/100' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Simulons des données de livraison (à remplacer par les données de l'utilisateur)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || '',
    country: currentUser?.country || 'France',
    phone: currentUser?.phone || '',
  });
  
  // Calculs
  const cartItems = dummyCartItems;
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setLoading(true);
    
    // Simulons un traitement de commande
    setTimeout(() => {
      toast.success('Commande passée avec succès!');
      setLoading(false);
      navigate('/');
    }, 1500);
  };
  
  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          Votre panier est vide. Ajoutez des produits avant de passer à la caisse.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Voir les produits
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Finaliser votre commande</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Information de livraison</h5>
            </Card.Header>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre prénom.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre nom.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer votre adresse.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Ville</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre ville.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Code postal</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre code postal.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pays</Form.Label>
                      <Form.Select
                        required
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Canada">Canada</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre numéro de téléphone.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <hr className="my-4" />
                
                <h5 className="mb-3">Méthode de paiement</h5>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    label="Carte bancaire"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-3 ps-4">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Numéro de carte</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="XXXX XXXX XXXX XXXX"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={3} className="mb-3">
                          <Form.Group>
                            <Form.Label>Expiration</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="MM/AA"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={3} className="mb-3">
                          <Form.Group>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="123"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                  
                  <Form.Check
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    label="PayPal"
                    className="mt-2"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  
                  <Form.Check
                    type="radio"
                    id="transfer"
                    name="paymentMethod"
                    label="Virement bancaire"
                    className="mt-2"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                </Form.Group>
                
                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Récapitulatif de commande</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="me-2"
                      />
                      <div>
                        <p className="mb-0">{item.name}</p>
                        <small className="text-muted">Quantité: {item.quantity}</small>
                      </div>
                    </div>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                </ListGroup.Item>
              ))}
              
              <ListGroup.Item>
                <div className="d-flex justify-content-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <div className="d-flex justify-content-between">
                  <span>Frais de livraison</span>
                  <span>
                    {shippingCost === 0 ? 
                      <span className="text-success">Gratuit</span> : 
                      `${shippingCost.toFixed(2)} €`
                    }
                  </span>
                </div>
                {shippingCost > 0 && (
                  <small className="text-muted">
                    Livraison gratuite à partir de 50€ d'achat
                  </small>
                )}
              </ListGroup.Item>
              
              <ListGroup.Item>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;