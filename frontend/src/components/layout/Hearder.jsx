import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import "./Header.css"; // Nous allons créer ce fichier CSS pour les styles personnalisés

const Header = () => {
  return (
    <header className="header-container shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div className="logo-container">
              <img src="/path-to-your-logo.png" alt="YTOY Logo" className="logo-img" />
              <span className="logo-text ms-2">
                <strong>YTOY</strong>
                <span className="text-orange">MARKETPLACE</span>
              </span>
            </div>
          </Link>

          {/* Toggler pour mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu et recherche */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Navigation */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Accueil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/a-propos">À propos</Link>
              </li>
            </ul>

            {/* Barre de recherche */}
            <form className="d-flex mx-lg-3 my-2 my-lg-0 search-form">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control border-end-0" 
                  placeholder="Cherchez ici..." 
                  aria-label="Search" 
                />
                <button type="submit" className="input-group-text bg-white border-start-0">
                  <FaSearch />
                </button>
              </div>
              <button className="btn btn-orange ms-2 d-none d-lg-block">Rechercher</button>
            </form>

            {/* Icônes Panier et Connexion */}
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              <Link to="/panier" className="cart-icon me-3 position-relative">
                <FaShoppingCart size={20} />
                <span className="cart-count">0</span>
              </Link>

              <Link to="/login" className="btn btn-sm btn-outline-orange">
                <FaUser className="me-1" /> Se connecter
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;