import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiClient } from '../../services/api'
import VendeurSidebar from './VendeurSidebar'

const ProductForm = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [produit, setProduit] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie_id: '', // Vérifiez que c'est bien orthographié comme dans la BD
    quantite_stock: '', // Ce champ sera envoyé comme 'stock' mais utilisé pour 'quantite_stock'
    images: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [categories, setCategories] = useState([])

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
        setIsLoading(true)
        // Récupération des catégories
        const categoriesResponse = await apiClient.get('/api/categories')
        setCategories(categoriesResponse.data)

        // Si on est en mode édition, récupérer les détails du produit
        if (productId) {
          const produitResponse = await apiClient.get(
            `/api/vendor/produits/${productId}`
          )
          const produitData = produitResponse.data

          setProduit({
            nom: produitData.nom,
            description: produitData.description,
            prix: produitData.prix,
            categorie_id: produitData.categorie_id,
            quantite_stock: produitData.quantite_stock
          })

          if (produitData.images) {
            setImagePreview(
              produitData.images.map(img => ({
                url: `http://localhost:8000${img.url}`,
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleNomChange = e => {
    setProduit({ ...produit, nom: e.target.value })
  }

  const handleDescriptionChange = e => {
    setProduit({ ...produit, description: e.target.value })
  }

  const handleQuantiteStockChange = e => {
    setProduit({ ...produit, quantite_stock: e.target.value })
  }
  const handlePrixChange = e => {
    setProduit({ ...produit, prix: e.target.value })
  }

  const handleCategorieChange = e => {
    setProduit({ ...produit, categorie_id: e.target.value })
  }

  const MAX_FILE_SIZE = 2048 * 1024 // 2048 Ko en bytes

  const compressImage = async file => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculer les nouvelles dimensions tout en gardant le ratio
          if (width > 1920) {
            height = Math.round((height * 1920) / width)
            width = 1920
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            blob => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            0.8 // Qualité de compression (0.8 = 80%)
          )
        }
      }
    })
  }

  const handleImageChange = async e => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles = []
      const validPreviews = []

      for (const file of filesArray) {
        if (file.size > MAX_FILE_SIZE) {
          // Si l'image est trop grande, on la compresse
          try {
            const compressedFile = await compressImage(file)
            if (compressedFile.size <= MAX_FILE_SIZE) {
              validFiles.push(compressedFile)
              validPreviews.push({
                url: URL.createObjectURL(compressedFile),
                file: compressedFile
              })
            } else {
              setMessage({
                text: `L'image ${file.name} est trop grande même après compression. La taille maximale est de 2 Mo.`,
                type: 'warning'
              })
            }
          } catch (error) {
            console.error('Erreur lors de la compression:', error)
            setMessage({
              text: `Erreur lors de la compression de l'image ${file.name}`,
              type: 'danger'
            })
          }
        } else {
          validFiles.push(file)
          validPreviews.push({
            url: URL.createObjectURL(file),
            file: file
          })
        }
      }

      setImageFiles([...imageFiles, ...validFiles])
      setImagePreview([...imagePreview, ...validPreviews])
    }
  }

  const removeImage = indexToRemove => {
    // Pour les images existantes vs nouvelles images
    if (imagePreview[indexToRemove].id) {
      // Image existante - à marquer pour suppression dans l'API
      const imagesToDelete = [
        ...(produit.imagesToDelete || []),
        imagePreview[indexToRemove].id
      ]
      setProduit({ ...produit, imagesToDelete })
    }

    setImagePreview(imagePreview.filter((_, index) => index !== indexToRemove))
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: '', type: '' })

    // Log du token
    const token = localStorage.getItem('token')
    console.log('Token:', token)

    // Validation des champs obligatoires
    if (
      !produit.nom ||
      !produit.description ||
      !produit.prix ||
      !produit.categorie_id ||
      !produit.quantite_stock
    ) {
      setMessage({
        text: 'Veuillez remplir tous les champs obligatoires',
        type: 'danger'
      })
      setIsLoading(false)
      return
    }

    // Validation du prix et de la quantité
    if (isNaN(produit.prix) || produit.prix <= 0) {
      setMessage({
        text: 'Le prix doit être un nombre positif',
        type: 'danger'
      })
      setIsLoading(false)
      return
    }

    if (isNaN(produit.quantite_stock) || produit.quantite_stock < 0) {
      setMessage({
        text: 'La quantité doit être un nombre positif ou nul',
        type: 'danger'
      })
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()

      // Ajouter les données du produit au formData
      formData.append('nom', produit.nom)
      formData.append('description', produit.description)
      formData.append('prix', produit.prix)
      formData.append('quantite_stock', produit.quantite_stock)
      formData.append('categorie_id', produit.categorie_id)

      // Log des données avant envoi
      console.log('Données du produit:', {
        nom: produit.nom,
        description: produit.description,
        prix: produit.prix,
        quantite_stock: produit.quantite_stock,
        categorie_id: produit.categorie_id
      })

      // Ajouter les images
      imageFiles.forEach(file => {
        formData.append('images[]', file)
      })

      // Gérer les suppressions d'images si nécessaire
      if (produit.imagesToDelete && produit.imagesToDelete.length > 0) {
        produit.imagesToDelete.forEach(id => {
          formData.append('images_to_delete[]', id)
        })
      }

      // Log des en-têtes de la requête
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
      console.log('Headers:', headers)

      let response
      console.log('Données du produit:', formData.get('nom'))

      if (productId) {
        // Mise à jour
        response = await axios.post(
          `http://localhost:8000/api/vendor/produits/${productId}`,
          formData,
          { headers }
        )
      } else {
        // Création
        response = await axios.post(
          'http://localhost:8000/api/vendor/produits',
          formData,
          { headers }
        )
      }

      setMessage({
        text: productId
          ? 'Produit modifié avec succès!'
          : 'Produit ajouté avec succès!',
        type: 'success'
      })

      // Rediriger vers la liste des produits après un court délai
      setTimeout(() => {
        navigate('/vendeur/products')
      }, 2000)
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data)
      console.error('Status:', error.response?.status)
      console.error('Headers:', error.response?.headers)
      console.error('Config:', error.config)
      console.error('Request:', error.request)

      setMessage({
        text:
          error.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement du produit",
        type: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar />
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <Card className='shadow-sm'>
            <Card.Header className='bg-dark text-white'>
              <h2>
                {productId
                  ? 'Modifier le produit'
                  : 'Ajouter un nouveau produit'}
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
                        name='nom'
                        value={produit.nom}
                        onChange={handleNomChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                      <Form.Label>Prix (FCFA)</Form.Label> {/* Ici FCFA */}
                      <Form.Control
                        type='number'
                        step='1' // Pas besoin de décimales en FCFA, en général
                        name='prix'
                        value={produit.prix}
                        onChange={handlePrixChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                      <Form.Label>Stock disponible</Form.Label>
                      <Form.Control
                        type='number'
                        name='quantite_stock'
                        value={produit.quantite_stock}
                        onChange={handleQuantiteStockChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                      <Form.Label>Catégorie</Form.Label>
                      <Form.Select
                        name='categorie_id'
                        value={produit.categorie_id}
                        onChange={handleCategorieChange}
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
                        value={produit.description}
                        onChange={handleDescriptionChange}
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
                    style={{
                      backgroundColor: '#FF6600',
                      borderColor: '#FF6600'
                    }}
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
        </main>
      </div>
    </div>
  )
}

export default ProductForm
