import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { apiClient, apiClient_auth } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import useCartStore from '../../store/cartStore'
import CartModal from '../cart/CartModal'
import { motion } from 'framer-motion'
import './HomeProducts.css'

const HomeProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { setCartModalOpen } = useCartStore()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Get CSRF token first if needed
      await apiClient_auth.get('/sanctum/csrf-cookie')
      const response = await apiClient.get('/produits/getFeatured', {
        withCredentials: true
      })
      setProducts(response.data)
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
      console.error('Message d\'erreur détaillé:', errorMessage)
      console.error('Status:', err.response?.status)
      console.error('Headers:', err.response?.headers)
      setError(
        `Erreur: ${errorMessage}`
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addToCart = async productId => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      await apiClient.post('/panier/add', {
        produit_id: productId,
        quantite: 1
      })
      // Déclencher l'événement de mise à jour du panier
      window.dispatchEvent(new Event('cartUpdated'))
      // Ouvrir le modal du panier
      setCartModalOpen(true)
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true)
      } else {
        console.error("Erreur lors de l'ajout au panier", error)
        setError("Erreur lors de l'ajout au panier")
      }
    }
  }

  if (loading) {
    return (
      <Container className='text-center my-5'>
        <Spinner animation='border' role='status' style={{ color: '#F98B3A' }}>
          <span className='visually-hidden'>Chargement...</span>
        </Spinner>
      </Container>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <>
      <Container fluid2 className='home-container my-4 px-4'>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="section-title text-center mb-5"
        >
          <h2 className='display-4 fw-bold text-dark mb-3'>Nos Produits</h2>
          <p className='lead text-muted'>Découvrez notre sélection de produits de qualité</p>
        </motion.div>

        {error && <Alert variant='danger'>{error}</Alert>}

        {products.length === 0 ? (
          <Alert variant='info'>Aucun produit disponible pour le moment.</Alert>
        ) : (
          <Row className='g-4'>
            {products.map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <motion.div variants={itemVariants}>
                  <Card className='product-card h-100 border-0 shadow-sm'>
                    <div className="card-img-wrapper">
                      {product.thumbnail && product.thumbnail[0] && (
                        <Card.Img
                          variant='top'
                          src={`http://149.202.43.206${product.thumbnail.startsWith('/storage/') ? product.thumbnail : '/storage/' + product.thumbnail}`}
                          alt={product.nom}
                          className="product-image"
                        />
                      )}
                      <div className="card-overlay">
                        <Button
                          className="details-button"
                          variant='light'
                          onClick={() => navigate(`/produits/${product.id}`)}
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                    <Card.Body className='d-flex flex-column'>
                      <Card.Title className="product-title">{product.nom}</Card.Title>
                      <Card.Text className='product-description'>
                        {product.description.substring(0, 100)}...
                      </Card.Text>
                      <div className='mt-auto d-flex justify-content-between align-items-center'>
                        <span className='product-price'>{product.prix} FCFA</span>
                        <Button
                          className='add-to-cart-btn'
                          onClick={() => addToCart(product.id)}
                          disabled={product.quantite_stock <= 0}
                        >
                          <i className='bi bi-cart-plus'></i>
                          {product.quantite_stock > 0 ? 'Ajouter' : 'Rupture'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

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
    </>
  )
}

export default HomeProducts