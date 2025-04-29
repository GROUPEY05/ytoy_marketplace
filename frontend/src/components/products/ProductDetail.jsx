import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Utilisation du hook

// Simulez des données de produits (à remplacer par de vraies données d'API)
const dummyProducts = [
  { id: 1, name: 'Produit 1', price: 19.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 1.', stock: 15 },
  { id: 2, name: 'Produit 2', price: 29.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 2.', stock: 8 },
  { id: 3, name: 'Produit 3', price: 39.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 3.', stock: 20 },
  { id: 4, name: 'Produit 4', price: 49.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 4.', stock: 5 },
  { id: 5, name: 'Produit 5', price: 59.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 5.', stock: 12 },
  { id: 6, name: 'Produit 6', price: 69.99, image: '/api/placeholder/500/300', description: 'Description détaillée du produit 6.', stock: 3 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // ✅ Remplacement ici
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setTimeout(() => {
          const foundProduit = dummyProduits.find(p => p.id === parseInt(id));
          if (foundProduit) {
            setProduit(foundProduit);
          } else {
            setError('Produit non trouvé');
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        setError('Erreur lors du chargement du produit');
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (produit?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    toast.success(`${quantity} ${produit.nom} ajouté(s) au panier`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Retour aux produits
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button className="mb-4" variant="outline-secondary" onClick={() => navigate('/products')}>
        <i className="bi bi-arrow-left"></i> Retour aux produits
      </Button>

      {produit && (
        <Row>
          <Col md={6}>
            <Image src={produit.image} alt={produit.name} fluid className="rounded" />
          </Col>
          <Col md={6}>
            <h1>{produit.nom}</h1>
            <p className="fs-3 fw-bold text-primary">{produit.prix.toFixed(2)} €</p>
            <p>{produit.description}</p>

            <p className={`mb-2 ${produit.stock < 5 ? 'text-danger' : 'text-success'}`}>
              {produit.stock > 0 ? `En stock: ${produit.stock} disponible(s)` : 'Rupture de stock'}
            </p>

            {produit.stock > 0 && (
              <div className="d-flex gap-3 align-items-center mb-4">
                <Form.Group style={{ width: '100px' }}>
                  <Form.Label>Quantité</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={produit.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </Form.Group>
                <Button variant="primary" size="lg" className="mt-4" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus me-2"></i> Ajouter au panier
                </Button>
              </div>
            )}

            {currentUser?.role === 'vendeur' && (
              <div className="mt-4 p-3 bg-light rounded">
                <h5>Options de vendeur</h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-pencil me-1"></i> Modifier
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <i className="bi bi-trash me-1"></i> Supprimer
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail;