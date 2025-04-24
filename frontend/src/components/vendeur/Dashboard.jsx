// src/components/vendeur/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const VendeurDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    sales: 0,
    revenue: 0,
    products: 0,
    orders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    setTimeout(() => {
      setStats({
        sales: 126,
        revenue: 8754.50,
        products: 45,
        orders: 78
      });
      
      setRecentOrders([
        { id: 1001, customer: 'Jean Dupont', date: '15/04/2025', status: 'En attente', total: 129.99 },
        { id: 1002, customer: 'Marie Leroy', date: '14/04/2025', status: 'Expédié', total: 89.50 },
        { id: 1003, customer: 'Thomas Martin', date: '13/04/2025', status: 'Livré', total: 210.25 },
        { id: 1004, customer: 'Emma Petit', date: '12/04/2025', status: 'En attente', total: 45.00 },
        { id: 1005, customer: 'Lucas Bernard', date: '11/04/2025', status: 'Annulé', total: 67.75 }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container-fluid2 mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <div className="avatar bg-primary rounded-circle p-3 mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="fs-1 text-white">{currentUser?.vendeur?.nom_boutique?.charAt(0) || currentUser?.prenom?.charAt(0)}</span>
              </div>
              <h5>{currentUser?.vendeur?.nom_boutique || 'Ma Boutique'}</h5>
              <span className="badge bg-success">Vendeur vérifié</span>
            </div>
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/vendeur/dashboard" className="nav-link active">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Tableau de bord
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/products" className="nav-link">
                  <i className="bi bi-box me-2"></i>
                  Produits
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/orders" className="nav-link">
                  <i className="bi bi-bag me-2"></i>
                  Commandes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/customers" className="nav-link">
                  <i className="bi bi-people me-2"></i>
                  Clients
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/reviews" className="nav-link">
                  <i className="bi bi-star me-2"></i>
                  Avis clients
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/analytics" className="nav-link">
                  <i className="bi bi-graph-up me-2"></i>
                  Statistiques
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/settings" className="nav-link">
                  <i className="bi bi-gear me-2"></i>
                  Paramètres
                </Link>
              </li>
            </ul>
            
            <hr />
            
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <Link to="/vendeur/profile" className="nav-link">
                  <i className="bi bi-person me-2"></i>
                  Profil
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendeur/help" className="nav-link">
                  <i className="bi bi-question-circle me-2"></i>
                  Aide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Tableau de bord Vendeur</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">Exporter</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Imprimer</button>
              </div>
              <button type="button" className="btn btn-sm btn-primary">
                <i className="bi bi-plus"></i> Ajouter un produit
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Ventes (Mensuel)</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.sales}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-cart fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Revenus (Mensuel)</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.revenue.toFixed(2)} €</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-currency-euro fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Produits</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.products}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-box fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Commandes en attente</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.orders}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-clock fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders table */}
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Commandes récentes</h6>
                  <Link to="/vendeur/orders" className="btn btn-sm btn-primary">
                    Voir tout
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Client</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>
                              <span className={`badge ${
                                order.status === 'Livré' ? 'bg-success' : 
                                order.status === 'Expédié' ? 'bg-info' : 
                                order.status === 'En attente' ? 'bg-warning' : 
                                'bg-danger'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{order.total.toFixed(2)} €</td>
                            <td>
                              <Link to={`/vendeur/orders/${order.id}`} className="btn btn-sm btn-outline-primary me-1">
                                <i className="bi bi-eye"></i>
                              </Link>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="bi bi-truck"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Tips */}
              <div className="row">
                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Actions rapides</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 mb-3">
                          <Link to="/vendeur/products/add" className="btn btn-success btn-block w-100">
                            <i className="bi bi-plus-circle me-2"></i>Ajouter un produit
                          </Link>
                        </div>
                        <div className="col-6 mb-3">
                          <Link to="/vendeur/orders/pending" className="btn btn-warning btn-block w-100">
                            <i className="bi bi-clock me-2"></i>Commandes en attente
                          </Link>
                        </div>
                        <div className="col-6 mb-3">
                          <Link to="/vendeur/promotions" className="btn btn-info btn-block w-100">
                            <i className="bi bi-tag me-2"></i>Créer une promotion
                          </Link>
                        </div>
                        <div className="col-6 mb-3">
                          <Link to="/vendeur/inventaire" className="btn btn-secondary btn-block w-100">
                            <i className="bi bi-list-check me-2"></i>Gérer le stock
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Astuces pour les vendeurs</h6>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>
                          Utilisez des photos de qualité pour vos produits
                        </li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>
                          Répondez rapidement aux questions des clients
                        </li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>
                          Maintenez votre inventaire à jour
                        </li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>
                          Offrez des promotions saisonnières pour attirer plus de clients
                        </li>
                        <li><i className="bi bi-check-circle text-success me-2"></i>
                          Demandez des avis à vos clients satisfaits
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendeurDashboard;