import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../services/api'

const HomeProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('api/produits/featured')
      setProducts(response.data)
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err)
      setError(
        'Impossible de charger les produits. Veuillez réessayer plus tard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addToCart = async productId => {
    try {
      await apiClient.post('/cart/add', {
        product_id: productId,
        quantity: 1
      })
      // Optionnel : Afficher une notification de succès
      navigate('/cart')
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier", error)
      setError("Erreur lors de l'ajout au panier")
    }
  }

  if (loading) {
    return (
      <Container className='text-center my-5'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Chargement...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <Container className='my-4'>
      <h2 className='mb-4'>nos </h2>

      {error && <Alert variant='danger'>{error}</Alert>}

      {products.length === 0 ? (
        <Alert variant='info'>Aucun produit disponible pour le moment.</Alert>
      ) : (
        <Row>
          {products.map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
              <Card className='h-100 shadow-sm'>
                {console.log('Rendering image with URL:', product)}
                {product.thumbnail && product.thumbnail[0] && (
                  <>
                    <Card.Img
                      variant='top'
                      src={`http://localhost:8000${product.thumbnail}`}
                      alt={product.nom}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </>
                )}
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>{product.nom}</Card.Title>
                  <Card.Text className='text-muted mb-2'>
                    {product.description.substring(0, 100)}...
                  </Card.Text>
                  <div className=' d-flex gap-4' >
                    <Card.Text className=' fw-bold ' style={{color: '#F98B3A',}}>
                      {product.prix} FCFA
                    </Card.Text>
                    <Button
                      
                      style={{backgroundColor: '#F98B3A', height: '35px' , border: 'none', borderRadius: '5px', fontSize: '13px', color: '#000000' }}
                      className='d-flex btn-lg gap-2'
                      onClick={() => addToCart(product.id)}
                      disabled={product.quantite_stock <= 0}
                    >
                      <i className='bi bi-cart-fill' style={{ fontSize: '14px', color:'#000000' }}></i>
                        <strong>{product.quantite_stock > 0
                          ?  'Ajouter'
                          : 'Rupture de stock'}</strong>
                    </Button>
                  </div><br />
                  <div className='mt-auto d-flex gap-2 '>
                    
                    <Button
                      className='btn w-100'
                      variant='outline-dark ' style={{ hover: '#F98B3A',  }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Voir détails
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default HomeProducts
