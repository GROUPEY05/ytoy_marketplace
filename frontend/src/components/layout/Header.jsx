import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
<link
  rel='stylesheet'
  href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
></link>


const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && user) {
        const response = await axios.get('http://localhost:8000/api/cart/count', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartCount(response.data.count);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'articles:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Écouter les mises à jour du panier
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <header className='  d-flex  ' style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', position: 'sticky', top: '0', zIndex: '1000', backgroundColor: 'white'}}>
        <div className='container d-flex align-items-center gap-3 justify-content-between'>
          <div>
            <img
              src='http://localhost:5173/image/logo_ytoy.png'
              alt=''
              style={{ maxWidth: '110px' }}
            />
          </div>
          <div className='mb-2 mb-lg-0 d-flex gap-5'>
            <a
              href='/'
              style={{
                fontSize: '16px',
                color: '#FF6F00',
                textDecoration: 'none'
              }}
            >
              Accueil
            </a>
          
            <a
              href='/about'
              style={{
                fontSize: '16px',
                textDecoration: 'none',
                color: '#000000'
              }}
            >
              A propos
            </a>
          </div>
              {/* searchbar et bouton rechercher */}
          <form className='d-flex gap-2' role='search' onSubmit={handleSearch}>
            <div
              className='d-flex'
              style={{ position: 'relative', width: '300px' }}
            >
              <input
                className='form-control me-2'
                type='search'
                placeholder='cherchez ici....'
                aria-label='Search'
                style={{ width: '100%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                className='position-absolute top-50'
                style={{
                  right: '50px',
                  cursor: 'pointer',
                  transform: 'translateY(-50%)'
                }}
              >
                <i className='bi bi-search'></i>
              </div>
            </div>
            <button className='btn btn-success' type='submit' style={{backgroundColor: '#FF6F00', border:'none'}}>
              Rechercher
            </button>
          </form>

          {/* Icônes Panier et Connexion/Déconnexion */}
          <div className='d-flex gap-5 align-items-center mt-3 mt-lg-0'>
            {user && (
              <Link to="/cart" className='cart-icon me-3 position-relative'>
                <i className='bi bi-cart-fill' style={{ fontSize: '24px', color:'#000000' }}></i>
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill' style={{backgroundColor: '#FF6F00'}}>
                  {cartCount}
                </span>
              </Link>
            )}

            {!user ? (
              <Link to="/login" className='btn btn-success' style={{backgroundColor: '#FF6F00', border:'none', color: '#ffffff', textDecoration: 'none'}}>
                Se connecter
              </Link>
            ) : (
              <div className='d-flex gap-3'>
                {user.role === 'vendeur' && (
                  <Link to="/vendeur/dashboard" className='btn btn-outline-primary'>
                    Dashboard Vendeur
                  </Link>
                )}
                {user.role === 'administrateur' && (
                  <Link to="/admin/dashboard" className='btn btn-outline-primary'>
                    Dashboard Admin
                  </Link>
                )}
                {user.role === 'acheteur' && (
                  <Link to="/acheteur/dashboard" className='btn btn-outline-primary'>
                    Mes commandes
                  </Link>
                )}
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }} 
                  className='btn btn-danger'
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;