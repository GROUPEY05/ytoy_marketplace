// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';




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
      console.log('Login Response:', response);

      // Stocker le jeton d'authentification dans le localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);  // Vous stockez ici le jeton d'authentification
    }
      
      // Utiliser le chemin de redirection fourni par le serveur
      if (response.redirect_to) {
        navigate(response.redirect_to);
      } else {
        // Fallback au cas où redirect_to n'est pas fourni
        const userRole = response.utilisateur.role;
        console.log('User Role:', userRole);
        if (userRole === 'administrateur') {
          navigate('/admin/dashboard');
        } else if (userRole === 'vendeur') {
          navigate('/vendeur/dashboard');
        } else if (userRole === 'acheteur') {
          navigate('acheteur/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (

   
    <div className="container-fluid vh-100">
      <div className="row justify-content-center align-items-center h-100" >
        <div className="col-12  col-lg-8 col-sm-10 col-xl-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header   text-center "  style={{ color: '#FFFFFF' }} >
              <div>
                <h3 className="mb-0 fs-4" style={{ color: '#FF6F00' }}> <strong>Connexion</strong></h3>
              </div>
              
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
                    required />
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
                    required />
                  <label htmlFor="mot_de_passe">Mot de passe</label>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                  <div className="form-check mb-2 mb-md-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                      name="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="/forgot-password" className="small text-black text-decoration-none" style={{ color: '#FF6F00' }}>
                    Mot de passe oublié?
                  </a>
                </div>

                <div className="d-grid" style={{ color: '#FF6F00' }}>
                  <button
                    type="submit"
                    className="btn btn-orange btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" ></span>
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
              Nouveau sur Ytoy Marketplace ?
                <a href="/register" className="text-decoration-none ms-1" style={{ color: '#FF6F00' }}>
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



