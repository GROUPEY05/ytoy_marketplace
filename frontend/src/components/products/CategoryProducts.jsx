import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import useCartStore from '../../store/cartStore';

const CategoryProducts = ({ categoryId, categoryName, limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { setCartModalOpen } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(`Tentative de récupération des produits pour la catégorie ${categoryId}`);
        
        const response = await apiClient.get(`/categories/${categoryId}/produits?limit=${limit}`);
        console.log('Réponse API pour les produits:', response);
        
        if (response.data && Array.isArray(response.data)) {
          console.log('Format 1: Tableau direct', response.data);
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.produits)) {
          console.log('Format 2: response.data.produits', response.data.produits);
          setProducts(response.data.produits);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          console.log('Format 3: response.data.data', response.data.data);
          setProducts(response.data.data);
        } else {
          console.error('Format de données inattendu:', response.data);
          setProducts([]);
        }
        setError('');
      } catch (err) {
        console.error(`Erreur lors du chargement des produits de la catégorie ${categoryName}:`, err);
        console.error('Détails de l\'erreur:', err.response?.data || err.message);
        setError(`Impossible de charger les produits de la catégorie ${categoryName}.`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId, categoryName, limit]);

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await apiClient.post('/api/panier/add', {
        produit_id: productId,
        quantite: 1
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setCartModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" style={{ color: '#FF6F00' }}>
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <Alert variant="info">Aucun produit disponible dans cette catégorie.</Alert>;
  }

  return (
    <div className="category-products-section mb-5">
      <h1 className="category-title mb-4" style={{ color: '#FF6F00' }}>{categoryName}</h1>
      <Row>
        {Array.isArray(products) ? products.map(product => (
          <Col key={product.id} xs={6} md={3} className="mb-4">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-100 product-card shadow-sm">
                <Link to={`/product/${product.id}`}>
                  <div className="card-img-container">
                    {product.images && product.images[0] && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8000${product.images[0].url}`}
                        alt={product.nom}
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <Card.Title className="product-title">{product.nom}</Card.Title>
                  </Link>
                  <Card.Text className="text-primary fw-bold mb-3">
                    {product.prix.toLocaleString()} FCFA
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => addToCart(product.id)}
                      disabled={product.quantite_stock <= 0}
                    >
                      {product.quantite_stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        )) : <p>Aucun produit disponible</p>}
      </Row>
      <div className="text-center mt-3">
        <Link to={`/categories/${categoryId}`} className="btn btn-outline-primary">
          Voir tous les produits de cette catégorie
        </Link>
      </div>
    </div>
  );
};

export default CategoryProducts;
