// src/components/Unauthorized.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Accès non autorisé</h4>
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h2 className="card-title mb-3">403 - Accès refusé</h2>
              <p className="card-text mb-4">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>

              {currentUser ? (
                <div className="alert alert-info">
                  <p className="mb-0">
                    <strong>Connecté en tant que:</strong> {currentUser.prenom} {currentUser.nom}<br />
                    <strong>Rôle:</strong> {currentUser.role}
                  </p>
                </div>
              ) : null}

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button onClick={goBack} className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour
                </button>
              
                {currentUser ? (
                  <Link to={
                    currentUser.role === 'administrateur' ? '/admin/dashboard' :
                    currentUser.role === 'vendeur' ? '/vendeur/dashboard' :
                    '/dashboard'
                  } className="btn btn-primary">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Aller à mon tableau de bord
                  </Link>
                ) : (
                  <Link to="/" className="btn btn-primary">
                    <i className="bi bi-house-door me-2"></i>
                    Accueil
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;