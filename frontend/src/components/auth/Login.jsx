// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      // Redirection basée sur le rôle de l'utilisateur
      navigate(response.redirect_to || '/');
    } catch (error) {
      setError(error.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12  col-lg-8 col-sm-10 col-xl-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0 fs-4">Connexion</h3>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
                
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="mot_de_passe"
                    name="mot_de_passe"
                    value={credentials.mot_de_passe}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                  />
                  <label htmlFor="mot_de_passe">Mot de passe</label>
                </div>
                
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                  <div className="form-check mb-2 mb-md-0">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="remember" 
                      name="remember"
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="/forgot-password" className="small text-primary text-decoration-none">
                    Mot de passe oublié?
                  </a>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small">
                Pas encore inscrit?
                <a href="/register" className="text-decoration-none ms-1">
                  Créer un compte
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;