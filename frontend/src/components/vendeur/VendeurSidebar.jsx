// src/components/vendeur/VendeurSidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const VendeurSidebar = ({ onLogout }) => {
  const { currentUser, logout } = useAuth()
   const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      alert('Erreur lors de la déconnexion. Veuillez réessayer.')
    }  finally {
      // Nettoyer complètement le localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Réinitialiser l'état
      setCurrentUser(null);
      setIsAuthenticated(false);
      
    }
  }

  return (
    <div className='col-md-3 col-lg-2 d-md-block bg-light sidebar collapse mt-0'>
      <div className='position-sticky pt-3'>
        <div className='text-center mb-4'>
          <div
            className='avatar rounded-circle p-3 mx-auto mb-3'
            style={{ width: '80px', height: '80px', background: 'green' }}
          >
            <span className='fs-1 text-white'>
              {currentUser?.vendeur?.nom_boutique?.charAt(0) ||
                currentUser?.nom?.charAt(0)}
            </span>
          </div>
          <h5>{currentUser?.vendeur?.nom_boutique || currentUser?.nom}</h5>
          <span className='badge bg-success'>Vendeur vérifié</span>
        </div>

        <ul className='nav flex-column'>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>
              <Home className='me-2' />
              Accueil
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/dashboard' className='nav-link'>
              <i className='bi bi-speedometer2 me-2'></i>
              Tableau de bord
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/products' className='nav-link'>
              <i className='bi bi-box me-2'></i>
              Produits
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/orders' className='nav-link'>
              <i className='bi bi-bag me-2'></i>
              Commandes
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/customers' className='nav-link'>
              <i className='bi bi-people me-2'></i>
              Clients
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/analytics' className='nav-link'>
              <i className='bi bi-graph-up me-2'></i>
              Statistiques
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/promotions' className='nav-link'>
              <i className='bi bi-tags me-2'></i>
              Promotions
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/reviews' className='nav-link'>
              <i className='bi bi-star me-2'></i>
              Avis clients
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/vendeur/settings' className='nav-link'>
              <i className='bi bi-gear me-2'></i>
              Paramètres
            </Link>
          </li>
          <li className='nav-item mt-4'>
            <button
              onClick={handleLogout}
              className='nav-link text-danger border-0 bg-transparent d-flex align-items-center'
            >
              <i className='bi bi-box-arrow-right me-2'></i>
              Déconnexion
            </button>
          </li>
        </ul>

        <hr />
      </div>
    </div>
  )
}

export default VendeurSidebar
