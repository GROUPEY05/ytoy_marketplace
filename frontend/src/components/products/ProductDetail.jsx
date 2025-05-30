import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api'; // Importez votre client API

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Remplacez dummyProduits par un appel API réel
        const response = await apiClient.get(`/produits/${productId}`);
        
        // Vérifiez les données reçues et ajustez selon votre structure d'API
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('Produit non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantite_stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!currentUser) {
        toast.warning("Veuillez vous connecter pour ajouter des articles au panier");
        navigate('/login');
        return;
      }

      // Appel API pour ajouter au panier
      await apiClient.post('/api/cart/add', {
        product_id: product.id,
        quantity: quantity
      });
      
      toast.success(`${quantity} ${product.nom} ajouté(s) au panier`);
      
      // Déclencher l'événement pour mettre à jour le compteur du panier
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
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

      {product && (
        <Row>
          <Col md={6}>
            <Image 
              src={product.image_url || 'http://localhost:5173/image/placeholder.png'} 
              alt={product.nom} 
              fluid 
              className="rounded"
            />
          </Col>
          <Col md={6}>
            <h1>{product.nom}</h1>
            <p className="fs-3 fw-bold text-primary">{product.prix?.toFixed(2) || '0.00'} frcfa</p>
            <p>{product.description}</p>

            <p className={`mb-2 ${product.quantite_stock < 5 ? 'text-danger' : 'text-success'}`}>
              {product.quantite_stock > 0 ? `En stock: ${product.quantite_stock} disponible(s)` : 'Rupture de stock'}
            </p>

            {product.quantite_stock > 0 && (
              <div className="d-flex gap-3 align-items-center mb-4">
                <Form.Group style={{ width: '100px' }}>
                  <Form.Label>Quantité</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={product.quantite_stock}
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
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate(`/vendeur/produits/edit/${product.id}`)}
                  >
                    <i className="bi bi-pencil me-1"></i> Modifier
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <i className="bi bi-trash me-1"></i> Supprimer
                  </Button>
                </div>
              </div>
            )}

            {/* Affichage de la catégorie */}
            {product.categorie && (
              <div className="mt-3">
                <span className="badge bg-info text-dark p-2">
                  Catégorie: {product.categorie.nom}
                </span>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail;