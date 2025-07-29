import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/stores');
        setStores(response.data);
        setError('');
      } catch (err) {
        console.error('Erreur lors du chargement des boutiques:', err);
        setError('Impossible de charger les boutiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="store-list">
      <h2 className="section-title mb-4" style={{ color: '#2c3e50' }}>
        Nos Boutiques
      </h2>
      <Row className="g-4">
        {stores.map((store) => (
          <Col key={store.id} md={4} xs={6} className="mb-4">
            <Link to={`/store/${store.id}`} className="text-decoration-none">
              <Card className="h-100 store-card">
                <Card.Body className="d-flex flex-column">
                  <div className="store-image-wrapper">
                    <Image
                      src={store.logo || '/placeholder-store.jpg'}
                      alt={store.nom_boutique}
                      className="store-logo"
                    />
                  </div>
                  <h5 className="mt-3 mb-2" style={{ color: '#FF6F00' }}>
                    {store.nom_boutique}
                  </h5>
                  <p className="text-muted mb-2">
                    {store.description.substring(0, 100)}...
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary px-3 py-1">
                      {store.ville}
                    </span>
                    {store.verifie && (
                      <span className="badge bg-success px-3 py-1">
                        Vérifiée
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StoreList;
