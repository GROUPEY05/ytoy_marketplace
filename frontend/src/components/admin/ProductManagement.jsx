import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/api'
import { toast } from 'react-hot-toast'
import AdminSidebar from './AdminSidebar'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  // États manquants
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  

  useEffect(() => {
    fetchProducts(1)
  }, [])

  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true)
      const response = await adminService.getProducts(pageNumber)
      console.log('Réponse API:', response)

      if (response.data) {
        setProducts(response.data.data) // <-- liste des produits ici !
        setLastPage(response.data.last_page) // <-- nombre de pages
        setPage(pageNumber)
      } else {
        setProducts([])
        toast.error('Format de données invalide')
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response || error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async productId => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      await adminService.deleteProduct(productId)
      toast.success('Produit supprimé avec succès')
      fetchProducts()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du produit')
    }
  }

  const goToPage = number => {
    if (number >= 1 && number <= lastPage) {
      fetchProducts(number)
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <div className='container-fluid4 '>
        <div className='row'>
          {/* Sidebar */}
          <AdminSidebar />
          <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            <div className='container mt-4'>
              <h2>Gestion des Produits</h2>
              <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Vendeur</th>
                      <th>Catégorie</th>
                      <th>Lien du produit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.nom}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                        </td>
                        <td>{product.nom}</td>
                        <td>{product.prix} FRCFA</td>
                        <td>{product.vendeur?.nom}</td>
                        <td>{product.categorie?.nom}</td>
                        <td>
                          <button
                            className='btn btn-outline-success btn-sm'
                            onClick={() => {
                              const productUrl = `${window.location.origin}/produits/${product.id}`
                              navigator.clipboard
                                .writeText(productUrl)
                                .then(() => {
                                  alert(
                                    'Lien copié dans le presse-papier: ' +
                                      productUrl
                                  )
                                  // ou utiliser toast.success si tu utilises react-hot-toast
                                })
                                .catch(() => {
                                  alert('Impossible de copier le lien')
                                })
                            }}
                            title='Copier le lien du produit'
                          >
                            Copier le lien
                          </button>
                        </td>

                        <td>
                          <button
                            className='btn btn-danger btn-sm'
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <nav aria-label='Pagination'>
                <ul className='pagination'>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button
                      className='page-link'
                      onClick={() => goToPage(page - 1)}
                    >
                      Précédent
                    </button>
                  </li>
                  {Array.from({ length: lastPage }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${page === i + 1 ? 'active' : ''}`}
                    >
                      <button
                        className='page-link'
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      page === lastPage ? 'disabled' : ''
                    }`}
                  >
                    <button
                      className='page-link'
                      onClick={() => goToPage(page + 1)}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default ProductManagement
