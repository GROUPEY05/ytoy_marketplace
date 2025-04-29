import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const VendeurDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProduits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/vendor/produits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduits(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setError('Erreur lors de la récupération des produits');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleDelete = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/vendor/produits/${produitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProduits(); // Rafraîchir la liste
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du produit');
    }
  };

  const confirmDelete = (produit) => {
    setSelectedProduct(produit);
    setShowDeleteModal(true);
  };

  if (loading) return <div className="text-center my-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mes Produits</h2>
        <Link to="/vendor/products/add" className="btn btn-primary">
          Ajouter un Produit
        </Link>
      </div>

      <Row>
        {produits.map((produit) => (
          <Col key={produit.id} md={4} className="mb-4">
            <Card>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img
                  variant="top"
                  src={produit.images && produit.images.length > 0
                    ? `http://localhost:8000/storage/${produit.images[0].url}`
                    : '/image/placeholder.jpg'}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title>{produit.nom}</Card.Title>
                <Card.Text>
                  Prix: {produit.prix}€<br />
                  Stock: <Badge bg={produit.quantite_stock > 0 ? 'success' : 'danger'}>
                    {produit.quantite_stock}
                  </Badge>
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Link
                    to={`/vendor/products/edit/${produit.id}`}
                    className="btn btn-outline-primary"
                  >
                    Modifier
                  </Link>
                  <Button
                    variant="outline-danger"
                    onClick={() => confirmDelete(produit)}
                  >
                    Supprimer
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le produit{' '}
          {selectedProduct?.nom} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedProduct?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendeurDashboard;
