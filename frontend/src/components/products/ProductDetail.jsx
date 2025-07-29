import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Alert
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient } from '../../services/api'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [produit, setProduit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://149.202.43.206/api/produits/${id}`)
        setProduit(res.data)
        console.log('Produit chargé:', res.data)
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
        setError('Produit introuvable ou supprimé.')
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = e => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= (produit?.quantite_stock || 1)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    try {
      if (!currentUser) {
        toast.warning(
          'Veuillez vous connecter pour ajouter des articles au panier'
        )
        navigate('/login')
        return
      }

      await apiClient.post('/panier/add', {
        produit_id: produit.id,
        quantite: quantity
      })

      toast.success(`${quantity} ${produit.nom} ajouté(s) au panier`)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      toast.error("Erreur lors de l'ajout au panier")
    }
  }

  if (loading) {
    return (
      <Container className='py-5 text-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Chargement...</span>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className='py-5'>
        <Alert variant='danger'>{error}</Alert>
        <Button variant='primary' onClick={() => navigate('/products')}>
          Retour aux produits
        </Button>
      </Container>
    )
  }

  return (
    <div>
      <Header />
      <Container className='py-5'>
        
        <Button
          className='mb-4'
          variant='outline-secondary'
          onClick={() => navigate('/produit-par-categorie')}
        >
          <i className='bi bi-arrow-left'></i> Retour aux produits
        </Button>

        {produit && (
          <Row>
            <Col md={6}>
              <Image
                src={
                  produit.images && produit.images.length > 0
                    ? produit.images[0].url.startsWith('http')
                      ? produit.images[0].url
                      : `http://149.202.43.206${produit.images[0].url}`
                    : ' http://149.202.43.206/image/placeholder.png'
                }
                alt={produit.nom}
                fluid
                className='rounded'
                style={{ width: '90%', height: '400px' }}
              />
            </Col>
            <Col md={6}>
              <h1>{produit.nom}</h1>
              <p className='fs-3 fw-bold text-primary'>
                {Number(produit.prix).toFixed(2)} FCFA
              </p>
              <p>{produit.description}</p>

              <p
                className={`mb-2 ${
                  produit.quantite_stock < 5 ? 'text-danger' : 'text-success'
                }`}
              >
                {produit.quantite_stock > 0
                  ? `En stock: ${produit.quantite_stock} disponible(s)`
                  : 'Rupture de stock'}
              </p>

              {produit.quantite_stock > 0 && (
                <div className='d-flex gap-3 align-items-center mb-4'>
                  <Form.Group style={{ width: '100px' }}>
                    <Form.Label>Quantité</Form.Label>
                    <Form.Control
                      type='number'
                      min='1'
                      max={produit.quantite_stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </Form.Group>
                  <Button
                    variant='orange'
                    size='lg'
                    className='mt-4'
                    onClick={handleAddToCart}
                  >
                    <i className='bi bi-cart-plus me-2'></i> Ajouter au panier
                  </Button>
                </div>
              )}

              {currentUser?.role === 'vendeur' && (
                <div className='mt-4 p-3 bg-light rounded'>
                  <h5>Options de vendeur</h5>
                  <div className='d-flex gap-2'>
                    <Button
                      variant='outline-primary'
                      size='sm'
                      onClick={() =>
                        navigate(`/vendeur/produits/edit/${produit.id}`)
                      }
                    >
                      <i className='bi bi-pencil me-1'></i> Modifier
                    </Button>
                    <Button variant='outline-danger' size='sm'>
                      <i className='bi bi-trash me-1'></i> Supprimer
                    </Button>
                  </div>
                </div>
              )}

              {produit.categorie && (
                <div className='mt-3'>
                  <span
                    className='badge  text-white p-2'
                    style={{ backgroundColor: 'orange' }}
                  >
                    Catégorie: {produit.categorie.nom}
                  </span>
                </div>
              )}
            </Col>
          </Row>
        )}
        
      </Container>
      <Footer />
    </div>
  )
}

export default ProductDetail
