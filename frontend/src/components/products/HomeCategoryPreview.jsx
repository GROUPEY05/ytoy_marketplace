import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import useCartStore from '../../store/cartStore';
import CartModal from '../cart/CartModal';
import './HomeProducts.css';

const HomeCategoryPreview = () => {
  const [categories, setCategories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setCartModalOpen } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/api/categories-avec-produits');
        setCategories(res.data);
      } catch (err) {
        setError("Erreur lors du chargement !");
        console.error('Erreur chargement des produits par catégorie', err);
      }
    };
    fetchData();
  }, []);

  const defaultImage =
    'data:image/svg+xml;base64,PHN2Zy...'; // même base64 que toi

  const getImageUrl = produit => {
    let imageUrl = defaultImage;
    if (produit.thumbnail && produit.thumbnail.url) {
      imageUrl = produit.thumbnail.url.startsWith('http')
        ? produit.thumbnail.url
        : `http://localhost:8000${produit.thumbnail.url}`;
    } else if (produit.images && produit.images.length > 0) {
      const imageData = produit.images[0];
      if (imageData.url) {
        imageUrl = imageData.url.startsWith('http')
          ? imageData.url
          : `http://localhost:8000${imageData.url}`;
      }
    }
    return imageUrl;
  };

  const addToCart = async productId => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      await apiClient.post('/api/panier/add', {
        produit_id: productId,
        quantite: 1,
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setCartModalOpen(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        setError("Erreur lors de l'ajout au panier");
      }
    }
  };

  return (
    <div className='container py-5 home-container'>
      <Button className='mb-4' variant='orange' onClick={() => navigate('/')}>
        <i className='bi bi-arrow-left'></i> Retour
      </Button>
      <h2 className='mb-4 section-title'>Produits par catégorie</h2>

      {error && <Alert variant='danger'>{error}</Alert>}

      {categories.map((categorie, i) => (
        <div key={i} className='mb-5'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h4>{categorie.nom}</h4>
            <Link
              to={`/categorie/${categorie.nom}`}
              className='btn btn-sm btn-outline-primary'
            >
              Voir tout
            </Link>
          </div>
          <Row className='g-4'>
            {categorie.produits.map(produit => (
              <Col key={produit.id} xs={12} sm={6} md={4} lg={3}>
                <Card className='product-card h-100 border-0 shadow-sm'>
                  <div className='card-img-wrapper'>
                    <Card.Img
                      variant='top'
                      src={getImageUrl(produit)}
                      alt={produit.nom}
                      className='product-image'
                      onError={e => {
                        e.target.src = defaultImage;
                        e.target.onerror = null;
                      }}
                    />
                    <div className="card-overlay">
                      <Button
                        className="details-button"
                        variant='light'
                        onClick={() => navigate(`/produits/${produit.id}`)}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                  <Card.Body className='d-flex flex-column'>
                    <Card.Title className="product-title">{produit.nom}</Card.Title>
                    <Card.Text className='product-description'>
                      {(produit.description || '').substring(0, 100)}...
                    </Card.Text>
                    <div className='mt-auto d-flex justify-content-between align-items-center'>
                      <span className='product-price'>{produit.prix} FCFA</span>
                      <Button
                        className='add-to-cart-btn'
                        onClick={() => addToCart(produit.id)}
                        disabled={produit.quantite_stock <= 0}
                      >
                        <i className='bi bi-cart-plus'></i>
                        {produit.quantite_stock > 0 ? 'Ajouter' : 'Rupture'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Connexion requise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Vous devez être connecté pour ajouter des produits au panier.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Fermer
          </Button>
          <Button
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </Button>
        </Modal.Footer>
      </Modal>

      <CartModal />
    </div>
  );
};

export default HomeCategoryPreview;
