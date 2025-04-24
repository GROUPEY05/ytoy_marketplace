import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
<link
  rel='stylesheet'
  href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
></link>


const Header = () => {
  return (
    <>
      <header className='  d-flex  ' style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
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
              href='/a_propos'
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
          <form class='d-flex gap-2' role='search'>
            <div
              className='d-flex'
              style={{ position: 'relative', width: '300px' }}
            >
              <input
                class='form-control me-2'
                type='search'
                placeholder='cherchez ici....'
                aria-label='Search'
                style={{ width: '100%' }}
              />
              <div
                className='position-absolute top-50   '
                style={{
                  right: '50px',
                  cursor: 'pointer',
                  transform: 'translateY(-50%)'
                }}
              >
                <i class='bi bi-search'></i>
              </div>
            </div>
            <button class='btn  btn-success' type='submit' style={{backgroundColor: '#FF6F00', border:'none'}}>
              Rechercher
            </button>
          </form>

          {/* Icônes Panier et Connexion */}
          <div className='d-flex  gap-5 align-items-center mt-3 mt-lg-0'>
            <a href="/cart"  className='cart-icon me-3 position-relative'>
              <i className='bi bi-cart-fill' style={{ fontSize: '24px', color:'#000000' }}></i>
              <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill ' style={{backgroundColor: '#FF6F00'}}>
                0
              </span>
            </a>

            <button class='btn  btn-success' type='submit' style={{backgroundColor: '#FF6F00', border:'none'}}>
              <a href="/login" style={{color: '#ffffff', textDecoration: 'none'}}> Se connecter</a>
              
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;