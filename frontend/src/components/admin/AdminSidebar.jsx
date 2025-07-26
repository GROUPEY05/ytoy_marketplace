// src/components/Admin/AdminSidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const AdminSidebar = ({ onLogout }) => {
  const { currentUser, logout } = useAuth()
  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      alert('Erreur lors de la déconnexion. Veuillez réessayer.')
    } finally {
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

    //  <div className='col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse '>
    <div className='col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse min-vh-100'>
      <div className='position-sticky '>
        <div className='d-flex align-items-center pb-3 mb-3 text-white text-decoration-none border-bottom'>
          <span className='fs-5 fw-semibold p-2'>Administration</span>
        </div>
        <div className="sidebar-sticky">
          <ul className="nav flex-column">

            <li className='nav-item'>
              <Link
                to='/'
                className='nav-link text-white'
              >
                <Home className='me-2' style={{ fontSize: '10px' }} />
                Accueil
              </Link>
            </li>
            <li className="nav-item">


              <Link to="/admin/dashboard" className="nav-link text-white active">
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/products-management" className="nav-link text-white">
                <i className="bi bi-box me-2"></i>
                Produits
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link text-white">
                <i className="bi bi-people me-2"></i>
                Utilisateurs
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/admin/categories' className='nav-link text-white'>
                <i className='bi bi-list-check me-2'></i>
                Catégories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/vendors" className="nav-link text-white">
                <i className="bi bi-shop me-2"></i>
                Vendeurs
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link text-white">
                <i className="bi bi-cart me-2"></i>
                Commandes
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/admin/statistics' className='nav-link text-white'>
                <i className='bi bi-graph-up me-2'></i>
                Statistiques
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/admin/reviews' className='nav-link text-white'>
                <i className='bi bi-star me-2'></i>
                Avis
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/admin/settings' className='nav-link text-white'>
                <i className='bi bi-gear me-2'></i>
                Paramètres
              </Link>
            </li>
            <div className='nav-item mt-4'>
              <button
                onClick={handleLogout}
                className='nav-link text-danger border-0 bg-transparent d-flex align-items-center'
              >
                <i className='bi bi-box-arrow-right me-2'></i>
                Déconnexion
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
    // </div>
  )
}
export default AdminSidebar