import React, { useState } from 'react'
import {
  Upload,
  DollarSign,
  Target,
  FileText,
  Plus,
  X,
  Eye
} from 'lucide-react'
import { FaFacebook, FaInstagram, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import VendeurSidebar from './VendeurSidebar'
const CampaignCreatePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    target_platforms: [],
    product_images: [],
    product_descriptions: [''],
    product_prices: ['']
  })

  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState([])

 

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: <FaFacebook color="#1877f3" /> },
  { id: 'instagram', name: 'Instagram', icon: <FaInstagram color="#E4405F" /> },
  { id: 'twitter', name: 'Twitter', icon: <FaXTwitter color="#000" /> }, // FaXTwitter dans react-icons v6 pour "X"
  { id: 'tiktok', name: 'TikTok', icon: <FaTiktok color="#010101" /> }
];


  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlatformChange = platformId => {
    setFormData(prev => ({
      ...prev,
      target_platforms: prev.target_platforms.includes(platformId)
        ? prev.target_platforms.filter(p => p !== platformId)
        : [...prev.target_platforms, platformId]
    }))
  }

  const handleImageUpload = e => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      product_images: [...prev.product_images, ...files]
    }))

    // Créer les previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        setPreviewImages(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      product_descriptions: [...prev.product_descriptions, ''],
      product_prices: [...prev.product_prices, '']
    }))
  }

  const removeProductField = index => {
    setFormData(prev => ({
      ...prev,
      product_descriptions: prev.product_descriptions.filter(
        (_, i) => i !== index
      ),
      product_prices: prev.product_prices.filter((_, i) => i !== index)
    }))
  }

  const updateProductField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('budget', formData.budget)

      formData.target_platforms.forEach(platform => {
        formDataToSend.append('target_platforms[]', platform)
      })

      formData.product_images.forEach(image => {
        formDataToSend.append('product_images[]', image)
      })

      formData.product_descriptions.forEach(desc => {
        formDataToSend.append('product_descriptions[]', desc)
      })

      formData.product_prices.forEach(price => {
        formDataToSend.append('product_prices[]', price)
      })

      const response = await fetch('/campaigns', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        alert('Campagne créée avec succès !')
        // Réinitialiser le formulaire
        setFormData({
          title: '',
          description: '',
          budget: '',
          target_platforms: [],
          product_images: [],
          product_descriptions: [''],
          product_prices: ['']
        })
        setPreviewImages([])
      } else {
        throw new Error('Erreur lors de la création de la campagne')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la création de la campagne')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar />
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <div className='col-12'>
            <div className='card shadow-lg'>
              <div className='card-header bg-success text-white'>
                <h3 className='card-title mb-0'>
                  <Target className='me-2' size={24} />
                  Lancer une Nouvelle Campagne Marketing
                </h3>
                <p className='mb-0 mt-2 opacity-75'>
                  Créez une campagne publicitaire pour promouvoir vos produits
                  sur les réseaux sociaux
                </p>
              </div>

              <div className='card-body'>
                <div>
                  <div className='row'>
                    {/* Informations de base */}
                    <div className='col-md-6'>
                      <div className='mb-4'>
                        <label className='form-label fw-bold'>
                          <FileText className='me-2' size={18} />
                          Titre de la campagne
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-lg'
                          name='title'
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder='Ex: Promotion Été 2024'
                          required
                        />
                      </div>

                      <div className='mb-4'>
                        <label className='form-label fw-bold'>
                          <DollarSign className='me-2' size={18} />
                          Budget de la campagne (FCFA)
                        </label>
                        <input
                          type='number'
                          className='form-control form-control-lg'
                          name='budget'
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder='Ex: 50000'
                          min='0'
                          step='1000'
                          required
                        />
                      </div>

                      <div className='mb-4'>
                        <label className='form-label fw-bold'>
                          Description de la campagne
                        </label>
                        <textarea
                          className='form-control'
                          name='description'
                          value={formData.description}
                          onChange={handleInputChange}
                          rows='4'
                          placeholder='Décrivez votre campagne marketing...'
                          required
                        />
                      </div>
                    </div>

                    {/* Plateformes ciblées */}
                    <div className='col-md-6'>
                      <div className='mb-4'>
                        <label className='form-label fw-bold'>
                          Plateformes ciblées
                        </label>
                        <div className='row'>
                          {platforms.map(platform => (
                            <div key={platform.id} className='col-6 mb-3'>
                              <div className='form-check form-check-lg'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  id={platform.id}
                                  checked={formData.target_platforms.includes(
                                    platform.id
                                  )}
                                  onChange={() =>
                                    handlePlatformChange(platform.id)
                                  }
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor={platform.id}
                                >
                                  <span className='me-2'>{platform.icon}</span>
                                  {platform.name}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upload d'images */}
                      <div className='mb-4'>
                        <label className='form-label fw-bold'>
                          <Upload className='me-2' size={18} />
                          Images des produits
                        </label>
                        <input
                          type='file'
                          className='form-control'
                          multiple
                          accept='image/*'
                          onChange={handleImageUpload}
                        />
                        <div className='form-text'>
                          Formats acceptés: JPG, PNG, GIF. Taille max: 2MB par
                          image
                        </div>
                      </div>

                      {/* Aperçu des images */}
                      {previewImages.length > 0 && (
                        <div className='mb-4'>
                          <label className='form-label fw-bold'>
                            Aperçu des images
                          </label>
                          <div className='row'>
                            {previewImages.map((image, index) => (
                              <div key={index} className='col-4 mb-2'>
                                <div className='position-relative'>
                                  <img
                                    src={image}
                                    alt={`Aperçu ${index + 1}`}
                                    className='img-fluid rounded'
                                    style={{
                                      height: '100px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <button
                                    type='button'
                                    className='btn btn-sm btn-danger position-absolute top-0 end-0 m-1'
                                    onClick={() => removeImage(index)}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Produits */}
                  <div className='row'>
                    <div className='col-12'>
                      <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h5 className='mb-0'>Détails des produits</h5>
                        <button
                          type='button'
                          className='btn btn-outline-primary btn-sm'
                          onClick={addProductField}
                        >
                          <Plus size={16} className='me-1' />
                          Ajouter un produit
                        </button>
                      </div>

                      {formData.product_descriptions.map((desc, index) => (
                        <div key={index} className='card mb-3'>
                          <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                              <h6 className='mb-0'>Produit {index + 1}</h6>
                              {formData.product_descriptions.length > 1 && (
                                <button
                                  type='button'
                                  className='btn btn-outline-danger btn-sm'
                                  onClick={() => removeProductField(index)}
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>

                            <div className='row'>
                              <div className='col-md-8'>
                                <div className='mb-3'>
                                  <label className='form-label'>
                                    Description du produit
                                  </label>
                                  <textarea
                                    className='form-control'
                                    value={desc}
                                    onChange={e =>
                                      updateProductField(
                                        index,
                                        'product_descriptions',
                                        e.target.value
                                      )
                                    }
                                    rows='3'
                                    placeholder='Description détaillée du produit...'
                                    required
                                  />
                                </div>
                              </div>
                              <div className='col-md-4'>
                                <div className='mb-3'>
                                  <label className='form-label'>
                                    Prix (FCFA)
                                  </label>
                                  <input
                                    type='number'
                                    className='form-control'
                                    value={formData.product_prices[index]}
                                    onChange={e =>
                                      updateProductField(
                                        index,
                                        'product_prices',
                                        e.target.value
                                      )
                                    }
                                    placeholder='Ex: 25000'
                                    min='0'
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className='row'>
                    <div className='col-12'>
                      <div className='d-flex justify-content-between'>
                        <button
                          type='button'
                          className='btn btn-outline-secondary'
                          onClick={() => window.history.back()}
                        >
                          Annuler
                        </button>
                        <button
                          type='button'
                          className='btn btn-success btn-lg'
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? (
                            <span
                              className='spinner-border spinner-border-sm me-2'
                              role='status'
                            />
                          ) : (
                            <Target className='me-2' size={18} />
                          )}
                          {loading
                            ? 'Création en cours...'
                            : 'Créer la campagne'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CampaignCreatePage
