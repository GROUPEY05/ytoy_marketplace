import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Image, Button, Badge } from 'react-bootstrap';
import { StarRating } from '../common/StarRating';
import { apiClient } from '../services/api';

const StorePage = () => {
  const { vendorId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const [storeResponse, productsResponse] = await Promise.all([
          apiClient.get(`/api/vendors/${vendorId}`),
          apiClient.get(`/api/vendors/${vendorId}/products`)
        ]);

        setStore(storeResponse.data);
        setProducts(productsResponse.data);
        setError('');
      } catch (err) {
        console.error('Erreur lors du chargement des données de la boutique:', err);
        setError('Impossible de charger les informations de la boutique');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [vendorId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger">{error}</h3>
      </Container>
    );
  }

  if (!store) {
    return null;
  }

  return (
    <Container className="py-5">
      {/* En-tête de la boutique */}
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <h1 className="display-4 mb-3" style={{ color: '#FF6F00' }}>
            {store.nom_boutique}
          </h1>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <StarRating rating={store.moyenne_avis || 0} maxRating={5} size="lg" />
            <span className="text-muted">({store.nombre_avis || 0} avis)</span>
          </div>
          <p className="lead text-muted">{store.description || 'Description non disponible'}</p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Badge bg="primary" className="px-3 py-2">
              {store.ville}
            </Badge>
            {store.verifie && (
              <Badge bg="success" className="px-3 py-2">
                Boutique vérifiée
              </Badge>
            )}
          </div>
        </Col>
      </Row>

      {/* Produits de la boutique */}
      <Row>
        <Col md={12}>
          <h2 className="mb-4" style={{ color: '#2c3e50' }}>
            Nos Produits
          </h2>
          <div className="row g-4">
            {products.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card className="h-100">
                  <Image
                    src={product.images[0]?.url || '/placeholder.jpg'}
                    alt={product.nom}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title className="h5">
                      {product.nom}
                    </Card.Title>
                    <Card.Text className="text-muted mb-2">
                      {product.description.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ color: '#FF6F00' }}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        }).format(product.prix)}
                      </h5>
                      <Button
                        variant="primary"
                        onClick={() => setShowLoginModal(true)}
                        style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </div>
        </Col>
      </Row>

      {/* Section des avis */}
      <Row className="mt-5">
        <Col md={12}>
          <h2 className="mb-4" style={{ color: '#2c3e50' }}>
            Avis des clients
          </h2>
          <div className="row">
            {store.avis?.map((review, index) => (
              <Col key={index} md={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="mb-1">{review.client.nom}</h5>
                        <StarRating rating={review.rating} maxRating={5} size="sm" />
                      </div>
                      <small className="text-muted">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                    <Card.Text className="mt-2">
                      {review.commentaire}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StorePage;
