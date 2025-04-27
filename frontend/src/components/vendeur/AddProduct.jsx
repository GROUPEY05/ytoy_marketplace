import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap'
import axios from 'axios'

const ProductForm = ({ productId = null }) => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    images: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [categories, setCategories] = useState([])
  const token = localStorage.getItem('auth_token')

  if (!token) {
    console.error('Token not found!')
  } else {
    axios
      .post('http://localhost:8000/api/vendor/produits', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Inclure le token dans l'en-tête Authorization
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error('Request failed', error.response)
      })
  }

  // Fetch les catégories au chargement du formulaire
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories')
        if (Array.isArray(response.data)) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error)
      }
    }

    fetchCategories()
  }, [])

  // Récupérer les catégories et les détails du produit si mode édition
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des catégories
        const categoriesResponse = await axios.get(
          'http://localhost:8000/api/categories'
        )
        setCategories(categoriesResponse.data)

        // Si on est en mode édition, récupérer les détails du produit
        if (productId) {
          const productResponse = await axios.get(
            `http://localhost:8000/api/vendor/produits/${productId}`
          )
          setProduct(productResponse.data)

          if (productResponse.data.images) {
            setImagePreview(
              productResponse.data.images.map(img => ({
                url: img.url,
                id: img.id
              }))
            )
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setMessage({
          text: 'Erreur lors du chargement des données',
          type: 'danger'
        })
      }
    }

    fetchData()
  }, [productId])

  const handleChange = e => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageChange = e => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Prévisualisation des images
      const newImagePreview = filesArray.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }))

      setImageFiles([...imageFiles, ...filesArray])
      setImagePreview([...imagePreview, ...newImagePreview])
    }
  }

  const removeImage = indexToRemove => {
    // Pour les images existantes vs nouvelles images
    if (imagePreview[indexToRemove].id) {
      // Image existante - à marquer pour suppression dans l'API
      const imagesToDelete = [
        ...(product.imagesToDelete || []),
        imagePreview[indexToRemove].id
      ]
      setProduct({ ...product, imagesToDelete })
    }

    setImagePreview(imagePreview.filter((_, index) => index !== indexToRemove))
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const formData = new FormData()

      // Ajouter les données du produit au formData
      Object.keys(product).forEach(key => {
        if (key !== 'images' && key !== 'imagesToDelete') {
          formData.append(key, product[key])
        }
      })

      // Ajouter les images
      imageFiles.forEach(file => {
        formData.append('images[]', file)
      })

      // Gérer les suppressions d'images si nécessaire
      if (product.imagesToDelete && product.imagesToDelete.length > 0) {
        product.imagesToDelete.forEach(id => {
          formData.append('images_to_delete[]', id)
        })
      }

      let response
      if (productId) {
        // Mise à jour
        formData.append('_method', 'PUT')
        response = await axios.post(
          `http://localhost:8000/api/vendor/produits/${productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Remplacez yourToken par le jeton récupéré
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      } else {
        // Création
        response = await axios.post(
          'http://localhost:8000/api/vendor/produits',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Remplacez yourToken par le jeton récupéré
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      }

      setMessage({
        text: productId
          ? 'Produit mis à jour avec succès!'
          : 'Produit ajouté avec succès!',
        type: 'success'
      })

      if (!productId) {
        // En mode création, réinitialiser le formulaire
        setProduct({
          title: '',
          description: '',
          price: '',
          category_id: '',
          stock: '',
          images: []
        })
        setImageFiles([])
        setImagePreview([])
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({
        text: `Erreur: ${
          error.response?.data?.message || 'Une erreur est survenue'
        }`,
        type: 'danger'
      })
    } finally {
      setIsLoading(false)
      // Scroll to top to show message
      window.scrollTo(0, 0)
    }
  }

  return (
    <Container className='my-4'>
      <Card className='shadow-sm'>
        <Card.Header className='bg-dark text-white'>
          <h2>
            {productId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>
        </Card.Header>
        <Card.Body>
          {message.text && (
            <Alert variant={message.type} className='mb-4'>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className='mb-3'>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Titre du produit</Form.Label>
                  <Form.Control
                    type='text'
                    name='title'
                    value={product.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Prix (FCFA)</Form.Label> {/* Ici FCFA */}
                  <Form.Control
                    type='number'
                    step='1' // Pas besoin de décimales en FCFA, en général
                    name='price'
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Stock disponible</Form.Label>
                  <Form.Control
                    type='number'
                    name='stock'
                    value={product.stock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select
                    name='category_id'
                    value={product.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value=''>Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nom}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    name='description'
                    value={product.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Images du produit</Form.Label>
                  <Form.Control
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  <Form.Text className='text-muted'>
                    Vous pouvez sélectionner plusieurs images
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Prévisualisation des images */}
            {imagePreview.length > 0 && (
              <div className='mb-4'>
                <h5>Images:</h5>
                <Row>
                  {imagePreview.map((image, index) => (
                    <Col xs={6} md={3} key={index} className='mb-3'>
                      <div className='position-relative'>
                        <img
                          src={image.url}
                          alt={`Prévisualisation ${index}`}
                          className='img-thumbnail'
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <Button
                          variant='danger'
                          size='sm'
                          className='position-absolute top-0 end-0'
                          onClick={() => removeImage(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            <div className='text-center mt-4'>
              <Button
                type='submit'
                style={{ backgroundColor: '#FF6600', borderColor: '#FF6600' }}
                size='lg'
                disabled={isLoading}
                className='px-5'
              >
                {isLoading ? 'Chargement...' : 'Sauvegarder'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProductForm
