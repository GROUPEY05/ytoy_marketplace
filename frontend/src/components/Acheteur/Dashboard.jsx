// src/components/ Acheteur/Dashboard.jsx
//dashboard acheteur
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      alert('Erreur lors de la déconnexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  // Exemple de données d'ordre - à remplacer par vos appels API réels
  useEffect(() => {
    // Simuler un chargement des commandes depuis l'API
    setTimeout(() => {
      setRecentOrders([
        { id: 1, date: '12/04/2025', status: 'Livré', total: 129.99 },
        { id: 2, date: '05/04/2025', status: 'En cours', total: 75.50 },
        { id: 3, date: '28/03/2025', status: 'En préparation', total: 225.75 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Mon profil</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div className="avatar bg-light rounded-circle p-3 mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1 text-primary">{currentUser.prenom.charAt(0)}{currentUser.nom.charAt(0)}</span>
                </div>
                <h5>{currentUser.prenom} {currentUser.nom}</h5>
                <p className="text-muted">{currentUser.email}</p>
              </div>
              <div className="list-group">
                <Link to="/dashboard" className="list-group-item list-group-item-action active">
                  <i className="bi bi-speedometer2 me-2"></i>Tableau de bord
                </Link>
                <Link to="/profile" className="list-group-item list-group-item-action">
                  <i className="bi bi-person me-2"></i>Éditer le profil
                </Link>
                <Link to="/orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-bag me-2"></i>Mes commandes
                </Link>
                <Link to="/wishlist" className="list-group-item list-group-item-action">
                  <i className="bi bi-heart me-2"></i>Liste de souhaits
                </Link>
                <Link to="/addresses" className="list-group-item list-group-item-action">
                  <i className="bi bi-geo-alt me-2"></i>Mes adresses
                </Link>
                <div className='nav-item mt-4'>
                  <button
                    onClick={handleLogout}
                    className='nav-link text-danger border-0 bg-transparent d-flex align-items-center'
                  >
                    <i className='bi bi-box-arrow-right me-2'></i>
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">Tableau de bord</h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Bienvenue dans votre espace personnel, {currentUser.prenom}!
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="bi bi-bag-check fs-1 text-primary mb-2"></i>
                      <h5>Commandes</h5>
                      <h3>3</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="bi bi-heart fs-1 text-success mb-2"></i>
                      <h5>Liste de souhaits</h5>
                      <h3>7</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <i className="bi bi-star fs-1 text-warning mb-2"></i>
                      <h5>Avis</h5>
                      <h3>4</h3>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Commandes récentes</h5>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Commande #</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'Livré' ? 'bg-success' : 
                              order.status === 'En cours' ? 'bg-primary' : 'bg-warning'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.total.toFixed(2)} €</td>
                          <td>
                            <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-end">
                    <Link to="/orders" className="btn btn-outline-primary">
                      Voir toutes les commandes
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;