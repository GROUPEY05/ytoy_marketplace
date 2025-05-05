import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async (searchTerm = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get(`/produits${queryString}`);
      setProducts(response.data.data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err);
      setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    fetchProducts(searchParam);
  }, [location.search]);

  const addToCart = async (productId) => {
    try {
      await apiClient.post('/cart/add', {
        product_id: productId,
        quantity: 1
      });
      // Optionnel : Afficher une notification de succès
      navigate('/cart');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier', error);
      setError('Erreur lors de l\'ajout au panier');
    }
  };

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
      <h2 className="mb-4">Produits disponibles</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {products.length === 0 ? (
        <Alert variant="info">
          Aucun produit disponible pour le moment.
        </Alert>
      ) : (
        <Row>
          {products.map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                {product.images && product.images[0] && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000/storage/${product.images[0].url}`}
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    {product.description.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text className="text-primary fw-bold mb-3">
                    {product.price} FCFA
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProductList;
