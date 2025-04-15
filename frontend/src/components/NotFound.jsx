// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="fs-3">
              <span className="text-danger">Oups!</span> Page introuvable.
            </p>
            <p className="lead">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <div className="mb-5">
            <img 
              src="/api/placeholder/400/300" 
              alt="Page non trouvée" 
              className="img-fluid"
            />
          </div>
          
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house-door me-2"></i>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;