import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { apiClient } from '../../services/api'
import CartModal from '../cart/CartModal'
import useCartStore from '../../store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import './Header.css'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setCartModalOpen } = useCartStore()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Réinitialiser le terme de recherche quand l'utilisateur navigue vers une autre page
  useEffect(() => {
    setSearchTerm('')
    setShowResults(false)
  }, [location.pathname])

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token && user) {
        const response = await apiClient.get('/api/cart/count')
        setCartCount(response.data.count)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier :", error)
    }
  }

  useEffect(() => {
    fetchCartCount()

    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [user])

  // Nouvelle fonction pour rechercher les produits pendant la saisie
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await apiClient.get(`/api/search/produits?query=${encodeURIComponent(query)}`)
      setSearchResults(response.data)
      setShowResults(true)
    } catch (error) {
      console.error("Erreur lors de la recherche de produits:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce pour éviter trop de requêtes pendant la saisie
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(searchTerm)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setUser(null)
    navigate('/')
  }

  // Fonction mise à jour pour gérer la soumission du formulaire
  const handleSearch = e => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
      setShowResults(false)
    }
  }

  // Fonction pour gérer le clic sur un résultat de recherche
  const handleResultClick = (productId) => {
    navigate(`/produits/${productId}`)
    setShowResults(false)
  }

  const handleInputFocus = () => {
    if (searchTerm.trim() && searchResults.length > 0) {
      setShowResults(true)
    }
  }

  const handleClickOutside = () => {
    setShowResults(false)
  }

  const handleCartClick = (e) => {
    e.preventDefault()
    setCartModalOpen(true)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className='header-container'
      >
        <div className='header-content'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="logo-container"
          >
            <img
              src='http://localhost:5173/image/logo_ytoy.png'
              alt='Logo'
              className="logo-image"
            />
          </motion.div>

          <nav className='nav-links'>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href='/'
              className='nav-link active'
            >
              Accueil
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href='/about'
              className='nav-link'
            >
              A propos
            </motion.a>
          </nav>

          <div className='search-wrapper'>
            <form className='search-form' onSubmit={handleSearch}>
              <div className='search-container'>
                <input
                  type='search'
                  placeholder='Rechercher un produit...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={handleInputFocus}
                  className='search-input'
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  className='search-button'
                >
                  <i className='bi bi-search'></i>
                </motion.button>
              </div>
            </form>

            {/* Affichage des résultats de recherche */}
            {showResults && searchResults.length > 0 && (
              <div className='search-results-dropdown'>
                {isSearching ? (
                  <div className='search-loading'>Recherche en cours...</div>
                ) : (
                  <>
                    <div className='results-header'>Résultats ({searchResults.length})</div>
                    <ul className='results-list'>
                      {searchResults.slice(0, 5).map(product => (
                        <li 
                          key={product.id} 
                          className='result-item'
                          onClick={() => handleResultClick(product.id)}
                        >
                          <div className='result-name'>{product.nom}</div>
                          {product.categorie && (
                            <span className='result-category'>{product.categorie.nom}</span>
                          )}
                          <div className='result-price'>{product.prix} frcfa</div>
                        </li>
                      ))}
                      {searchResults.length > 5 && (
                        <li className='more-results' onClick={handleSearch}>
                          Voir tous les résultats ({searchResults.length})
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <div className='actions-container'>
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    onClick={handleCartClick}
                    className='cart-button'    
                  >
                    <i className='bi bi-cart-fill'></i>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='cart-count'
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>

            {!user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to='/login' className='login-button'>
                  Se connecter
                </Link>
              </motion.div>
            ) : (
              <div className='user-actions'>
                {user.role === 'vendeur' && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to='/vendeur/dashboard' className='dashboard-button'>
                      Dashboard Vendeur
                    </Link>
                  </motion.div>
                )}
                {user.role === 'administrateur' && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to='/admin/dashboard' className='dashboard-button'>
                      Dashboard Admin
                    </Link>
                  </motion.div>
                )}
                {user.role === 'acheteur' && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to='/acheteur/dashboard' className='dashboard-button'>
                      Mes commandes
                    </Link>
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className='logout-button'
                >
                  Déconnexion
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Clic en dehors des résultats pour fermer le dropdown */}
      {showResults && (
        <div className="overlay" onClick={handleClickOutside}></div>
      )}

      <CartModal />
    </>
  )
}

export default Header