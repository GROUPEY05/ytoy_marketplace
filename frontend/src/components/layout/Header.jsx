import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { apiClient } from '../../services/api'
import CartModal from '../cart/CartModal'
import useCartStore from '../../store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import './Header.css'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { setCartModalOpen } = useCartStore()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setUser(null)
    navigate('/')
  }

  const handleSearch = e => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
    }
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

          <form className='search-form' onSubmit={handleSearch}>
            <div className='search-container'>
              <input
                type='search'
                placeholder='Rechercher un produit...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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

      <CartModal />
    </>
  )
}

export default Header
