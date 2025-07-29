import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.get('/wishlist');
      
      if (response.data) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la liste de souhaits:', error);
      setError('Impossible de charger votre liste de souhaits. Veuillez réessayer plus tard.');
      
      // En cas d'erreur, utiliser des données fictives pour la démo
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await apiClient.delete(`/wishlist/${productId}`);
      
      // Mettre à jour la liste après suppression
      setWishlistItems(wishlistItems.filter(item => item.produit_id !== productId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      setError('Impossible de supprimer cet article de votre liste de souhaits.');
    }
  };

  const addToCart = async (productId) => {
    try {
      await apiClient.post('/panier/add', {
        produit_id: productId,
        quantite: 1
      });
      
      alert('Produit ajouté au panier avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Impossible d\'ajouter ce produit au panier.');
    }
  };

  return (
    <>
      <Header />
      <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ma Liste de Souhaits</h2>
        <Link to="/acheteur/dashboard" className="btn btn-outline-primary">
          Retour au tableau de bord
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement de votre liste de souhaits...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-heart fs-1 text-muted mb-3"></i>
            <h4>Votre liste de souhaits est vide</h4>
            <p className="text-muted">Parcourez notre catalogue et ajoutez des produits à votre liste de souhaits!</p>
            <Link to="/produits" className="btn btn-primary mt-3">
              Découvrir nos produits
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {wishlistItems.map(item => (
            <Col md={4} key={item.id} className="mb-4">
              <Card>
                <div className="position-relative">
                  <Image 
                    src={item.produit?.image_url || 'https://via.placeholder.com/300x200?text=Produit'} 
                    className="card-img-top"
                    alt={item.produit?.nom}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Button 
                    variant="light" 
                    size="sm" 
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => removeFromWishlist(item.produit_id)}
                  >
                    <i className="bi bi-x-lg text-danger"></i>
                  </Button>
                </div>
                <Card.Body>
                  <Card.Title>{item.produit?.nom || 'Produit non disponible'}</Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    {item.produit?.prix || 0} FCFA
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Link to={`/produits/${item.produit_id}`} className="btn btn-outline-primary">
                      Voir détails
                    </Link>
                    <Button 
                      variant="success" 
                      onClick={() => addToCart(item.produit_id)}
                    >
                      <i className="bi bi-cart-plus me-1"></i> Ajouter
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    <Footer />
    </>
  );
};

export default Wishlist;
