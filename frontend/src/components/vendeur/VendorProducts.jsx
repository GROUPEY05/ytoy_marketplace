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
import { Link } from 'react-router-dom'
import { apiClient } from '../../services/api'
import { FaArrowLeft } from 'react-icons/fa'
import VendeurSidebar from './VendeurSidebar'

const VendorProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage] = useState(10)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editField, setEditField] = useState(null)
  const [editValue, setEditValue] = useState('')

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true)
      console.log('Tentative de récupération des produits du vendeur...')
      // Récupérer le token pour le débogage
      const token = localStorage.getItem('token')
      console.log("Token d'authentification présent:", !!token)

      // Utiliser la route correcte avec le préfixe api
      const response = await apiClient.get(
        `/vendor/produits?page=${page}&per_page=${perPage}`
      )
      console.log(
        'Requête envoyée à:',
        `/vendor/produits?page=${page}&per_page=${perPage}`
      )
      console.log('API Response:', response.data)
      const { data, current_page, last_page } = response.data

      // Log chaque produit et ses images
      data.forEach(product => {
        console.log('Product:', product.nom)
        console.log('Images:', product.images)
        if (product.images && product.images.length > 0) {
          console.log('First image URL:', product.images[0].url)
          // Vérifier si l'URL est absolue
          const isAbsolute =
            product.images[0].url.startsWith('http://') ||
            product.images[0].url.startsWith('https://') ||
            product.images[0].url.startsWith('/')
          console.log('Is URL absolute?', isAbsolute)
          // Afficher l'URL complète qui sera utilisée
          const fullUrl = isAbsolute
            ? product.images[0].url
            : `${process.env.REACT_APP_API_URL}${product.images[0].url}`
          console.log('Full URL that will be used:', fullUrl)
        }
      })

      // Transformer les URLs des images si nécessaire
      const transformedData = data.map(product => ({
        ...product,
        images:
          product.images?.map(image => ({
            ...image,
            url:
              image.url.startsWith('http://') ||
              image.url.startsWith('https://') ||
              image.url.startsWith('/')
                ? image.url
                : `${process.env.REACT_APP_API_URL}${image.url}`
          })) || []
      }))

      setProducts(transformedData)
      setCurrentPage(current_page)
      setTotalPages(last_page)
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err)
      setError(
        'Impossible de charger vos produits. Veuillez réessayer plus tard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const startEditing = (product, field) => {
    setEditingProduct(product)
    setEditField(field)
    setEditValue(product[field])
  }

  const handleUpdate = async (productId, field) => {
    if (!editValue || editValue === editingProduct[field]) {
      setEditingProduct(null)
      setEditField(null)
      return
    }

    try {
      const response = await apiClient.patch(
        `/vendor/produits/${produit.id}`,
        {
          [field]: editValue
        }
      )

      setProducts(
        products.map(p =>
          p.id === productId ? { ...p, [field]: editValue } : p
        )
      )

      setEditingProduct(null)
      setEditField(null)
      setEditValue('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error)
      setError('Erreur lors de la mise à jour du produit')
    }
  }

  const handleDelete = async productId => {
    try {
      await apiClient.delete(`/vendor/produits/${productId}`)
      setProducts(products.filter(p => p.id !== productId))
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression', error)
      setError('Erreur lors de la suppression du produit')
    }
  }

  const confirmDelete = product => {
    setProductToDelete(product)
    setShowDeleteModal(true)
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
    <div className='py-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar />
        <main  className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          
          <h2>Mes Produits</h2>
          <Link
            to='/vendeur/products/add'
            className='btn '
            style={{ backgroundColor: '#FF6F00', color: 'white' }}
          >
            <i className='bi bi-plus'></i> Ajouter un produit
          </Link>
        </div>

        {error && <Alert variant='danger'>{error}</Alert>}

        {products.length === 0 ? (
          <Alert variant='info'>
            Vous n'avez pas encore de produits. Commencez par en ajouter un !
          </Alert>
        ) : (
          <>
            <Row>
              {products.map(product => (
                <Col
                  key={product.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className='mb-4'
                >
                  <Card className='h-100 shadow-sm'>
                    {product.images && product.images[0] && (
                      <>
                        {console.log(
                          'Rendering image with URL:',
                          product.images[0].url
                        )}
                        <Card.Img
                          variant='top'
                          src={`http://149.202.43.206${product.images[0].url}`}
                          alt={product.nom}
                          style={{
                            height: '200px',
                            objectFit: 'cover',
                            backgroundColor: '#f8f9fa'
                          }}
                          onError={e => {
                            console.error('Image load error:', e)
                            console.error('Failed URL:', e.target.src)
                            e.target.onerror = null
                            e.target.src = '/placeholder-image.jpg'
                          }}
                        />
                      </>
                    )}
                    <Card.Body className='d-flex flex-column'>
                      <Card.Title>
                        {editingProduct?.id === product.id &&
                        editField === 'nom' ? (
                          <input
                            type='text'
                            className='form-control'
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => handleUpdate(product.id, 'nom')}
                            onKeyPress={e =>
                              e.key === 'Enter' &&
                              handleUpdate(product.id, 'nom')
                            }
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => startEditing(product, 'nom')}>
                            {product.nom}
                          </span>
                        )}
                      </Card.Title>
                      <Card.Text className='text-muted mb-2'>
                        {editingProduct?.id === product.id &&
                        editField === 'description' ? (
                          <textarea
                            className='form-control'
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() =>
                              handleUpdate(product.id, 'description')
                            }
                            rows='3'
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => startEditing(product, 'description')}
                          >
                            {product.description.substring(0, 100)}...
                          </span>
                        )}
                      </Card.Text>
                      <Card.Text className='text-primary fw-bold mb-3'>
                        {editingProduct?.id === product.id &&
                        editField === 'prix' ? (
                          <input
                            type='number'
                            className='form-control'
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => handleUpdate(product.id, 'prix')}
                            onKeyPress={e =>
                              e.key === 'Enter' &&
                              handleUpdate(product.id, 'prix')
                            }
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => startEditing(product, 'prix')}>
                            {product.prix} FCFA
                          </span>
                        )}
                      </Card.Text>
                      <Card.Text className='mb-2'>
                        Stock:{' '}
                        {editingProduct?.id === product.id &&
                        editField === 'quantite_stock' ? (
                          <input
                            type='number'
                            className='form-control d-inline-block w-auto'
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() =>
                              handleUpdate(product.id, 'quantite_stock')
                            }
                            onKeyPress={e =>
                              e.key === 'Enter' &&
                              handleUpdate(product.id, 'quantite_stock')
                            }
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() =>
                              startEditing(product, 'quantite_stock')
                            }
                          >
                            {product.quantite_stock}
                          </span>
                        )}
                      </Card.Text>
                      <div className='mt-auto d-flex gap-2'>
                        <Link
                          to={`/vendeur/products/edit/${product.id}`}
                          className='btn btn-outline-success flex-grow-1'
                        >
                          Modifier
                        </Link>
                        <Button
                          variant='outline-danger'
                          onClick={() => confirmDelete(product)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className='d-flex justify-content-center mt-4'>
                <nav>
                  <ul className='pagination'>
                    <li
                      className={`page-item ${
                        currentPage === 1 ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className='page-link'
                        onClick={() => fetchProducts(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${
                          currentPage === index + 1 ? 'active' : ''
                        }`}
                      >
                        <button
                          className='page-link'
                          onClick={() => fetchProducts(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className='page-link'
                        onClick={() => fetchProducts(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Modal de confirmation de suppression */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer le produit "
            {productToDelete?.title}" ? Cette action est irréversible.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant='danger'
              onClick={() => handleDelete(productToDelete?.id)}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
        </main>
      </div>
    </div>
  )
}

export default VendorProducts
