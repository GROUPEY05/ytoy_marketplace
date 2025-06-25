import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../services/api'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './HomeCategoryPreview.css'

const HomeCategoryPreview = () => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/api/categories-avec-produits')
        setCategories(res.data)
      } catch (err) {
        console.error('Erreur chargement des produits par catégorie', err)
      }
    }

    fetchData()
  }, [])

  const defaultImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4='

  const getImageUrl = produit => {
    let imageUrl = defaultImage

    // Cas 1 : le thumbnail est un objet avec un champ "url"
    if (produit.thumbnail && produit.thumbnail.url) {
      imageUrl = produit.thumbnail.url.startsWith('http')
        ? produit.thumbnail.url
        : `http://localhost:8000${produit.thumbnail.url}`
    }

    // Cas 2 : il n'y a pas de thumbnail, mais des images
    else if (produit.images && produit.images.length > 0) {
      const imageData = produit.images[0]
      if (imageData.url) {
        imageUrl = imageData.url.startsWith('http')
          ? imageData.url
          : `http://localhost:8000${imageData.url}`
      }
    }

    return imageUrl
  }

  return (
    <div className='container py-5'>
      <Button className='mb-4' variant='orange' onClick={() => navigate('/')}>
        <i className='bi bi-arrow-left'></i> Retour
      </Button>
      <h2 className='mb-4'>Produits par catégorie</h2>

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
          <div className='row'>
            {categorie.produits.map(produit => {
              const imageUrl = getImageUrl(produit)
              return (
                <div key={produit.id} className='col-md-3 mb-4'>
                  <div className='card h-100'>
                    <img
                      src={imageUrl}
                      alt={produit.nom}
                      className='card-img-top'
                      onError={e => {
                        e.target.src = defaultImage
                        e.target.onerror = null
                      }}
                      style={{
                        height: '200px',
                        objectFit: 'contain',
                        padding: '10px',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    <div className='card-overlay'>
                      <Button
                        className='details-button'
                        variant='light'
                        onClick={() => navigate(`/produits/${product.id}`)}
                      >
                        Voir détails
                      </Button>
                    </div>
                    <div className='card-body'>
                      <h6 className='card-title'>{produit.nom}</h6>
                      <p className='text-muted'>{produit.prix} FCFA</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomeCategoryPreview
