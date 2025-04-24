
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
<link
  rel='stylesheet'
  href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
></link>

import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour traiter l'abonnement à la newsletter
    alert(`Email ${email} soumis pour la newsletter!`);
    setEmail('');
  };

  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        {/* Section Newsletter */}
        <div className="d-flex flex-column align-items-center mb-4">
          <h5 className="mb-2">Abonnez-vous à notre newsletter</h5>
          
          <form onSubmit={handleSubmit} className="d-flex justify-content-center w-100">
            <div className="input-group mx-auto" style={{ maxWidth: '500px' }}>
              <div className="input-group-prepend">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fa fa-envelope text-white"></i>
                </span>
              </div>
              <input 
                type="email" 
                className="form-control bg-dark text-white border-secondary" 
                placeholder="Saisissez votre email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="btn btn-warning text-white"
              >
                S'abonner
              </button>
            </div>
          </form>
        </div>
        
        {/* Logo et liens */}
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <div className="bg-white rounded-circle p-2 me-2">
              <span className="text-dark fw-bold">Ytoy</span>
            </div>
            <span className="fw-bold fs-5">Marketplace</span>
          </div>
          
          {/* Menu principal */}
          <ul className="nav">
            <li className="nav-item"><a href="#" className="nav-link text-white px-2">Tarifs</a></li>
            <li className="nav-item"><a href="#" className="nav-link text-white px-2">À propos de nous</a></li>
            <li className="nav-item"><a href="#" className="nav-link text-white px-2">Centre d'aide</a></li>
            <li className="nav-item"><a href="#" className="nav-link text-white px-2">Contactez-nous</a></li>
            <li className="nav-item"><a href="#" className="nav-link text-white px-2">Carrières</a></li>
          </ul>
        </div>
        
        {/* Barre inférieure avec copyright et réseaux sociaux */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-4 border-top border-secondary">
          <div className="d-flex">
            <select className="form-select form-select-sm bg-dark text-white border-secondary me-2" style={{ width: 'auto' }}>
              <option>Français</option>
              <option>English</option>
            </select>
            
            <small className="text-white-50">
              © 2023 Brand, Inc. • <a href="#" className="text-white-50">Privacy</a> • <a href="#" className="text-white-50">Terms</a> • <a href="#" className="text-white-50">Sitemap</a>
            </small>
          </div>
          
          {/* Réseaux sociaux */}
          <div className="mt-3 mt-md-0">
            <a href="#" className="text-white-50 me-3"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white-50 me-3"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-white-50 me-3"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-white-50"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}