// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Bienvenue sur notre plateforme</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h3>Notre marketplace</h3>
                <p className="lead">
                  Découvrez un large choix de produits et services proposés par nos vendeurs partenaires.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-primary btn-lg">
                    Se connecter
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary btn-lg">
                    S'inscrire
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="mb-3">Bonjour, {currentUser.prenom} {currentUser.nom}</h4>
                  {currentUser.role === 'administrateur' && (
                    <Link to="/admin/dashboard" className="btn btn-primary btn-lg">
                      Accéder au tableau de bord administrateur
                    </Link>
                  )}
                  {currentUser.role === 'vendeur' && (
                    <Link to="/vendeur/dashboard" className="btn btn-primary btn-lg">
                      Accéder à votre espace vendeur
                    </Link>
                  )}
                  {currentUser.role === 'acheteur' && (
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                      Accéder à votre espace personnel
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <i className="bi bi-shop fs-1 text-primary mb-3"></i>
                  <h4>Vendez vos produits</h4>
                  <p>Devenez vendeur et proposez vos produits sur notre plateforme.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <i className="bi bi-cart-check fs-1 text-primary mb-3"></i>
                  <h4>Achetez en toute sécurité</h4>
                  <p>Profitez d'une expérience d'achat sécurisée et transparente.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <i className="bi bi-star fs-1 text-primary mb-3"></i>
                  <h4>Partagez votre avis</h4>
                  <p>Évaluez les produits et partagez votre expérience avec la communauté.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;