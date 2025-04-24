// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import authService from '../../services/api';


const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 1245,
        vendors: 78,
        products: 3567,
        orders: 456,
        revenue: 78540.50
      });
      
      setPendingVendors([
        { id: 1, nom: 'Pierre Martin', nom_boutique: 'Tech Solutions', date: '14/04/2025' },
        { id: 2, nom: 'Sophie Dubois', nom_boutique: 'Mode Élégante', date: '13/04/2025' },
        { id: 3, nom: 'Ahmed Bensalah', nom_boutique: 'Épices du Monde', date: '12/04/2025' },
        { id: 4, nom: 'Julie Leclerc', nom_boutique: 'Déco Maison', date: '11/04/2025' }
      ]);
      
      setRecentUsers([
        { id: 101, nom: 'Jean Dupont', email: 'jean@example.com', role: 'acheteur', date: '15/04/2025' },
        { id: 102, nom: 'Marie Leroy', email: 'marie@example.com', role: 'vendeur', date: '14/04/2025' },
        { id: 103, nom: 'Thomas Martin', email: 'thomas@example.com', role: 'acheteur', date: '14/04/2025' },
        { id: 104, nom: 'Emma Petit', email: 'emma@example.com', role: 'acheteur', date: '13/04/2025' },
        { id: 105, nom: 'Lucas Bernard', email: 'lucas@example.com', role: 'vendeur', date: '12/04/2025' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleVendorApproval = async (vendorId, approved) => {
    try {
        // Utiliser authService au lieu de apiClient
        const response = await authService[approved ? 'approveVendor' : 'rejectVendor'](vendorId);
        
        // Mise à jour de l'interface
        setPendingVendors(pendingVendors.filter(vendor => vendor.id !== vendorId));
        
        // Afficher un message de succès
        toast.success(response.data.message || 'Opération réussie');
    } catch (error) {
        console.error('Erreur lors de l\'approbation du vendeur:', error);
        toast.error('Une erreur est survenue lors de l\'approbation du vendeur');
    }
  };
  
  const fetchPendingVendors = async () => {
    try {
        // Utiliser authService au lieu de apiClient
        const response = await authService.getPendingVendors();
        setPendingVendors(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des vendeurs:', error);
    }
  };
  
  useEffect(() => {
    fetchPendingVendors();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="d-flex align-items-center pb-3 mb-3 text-white text-decoration-none border-bottom">
              <span className="fs-5 fw-semibold">Administration</span>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link active text-white">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Tableau de bord
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/utilisateurs" className="nav-link text-white">
                  <i className="bi bi-people me-2"></i>
                  Utilisateurs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/vendeurs" className="nav-link text-white">
                  <i className="bi bi-shop me-2"></i>
                  Vendeurs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/products" className="nav-link text-white">
                  <i className="bi bi-box me-2"></i>
                  Produits
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/commandes" className="nav-link text-white">
                  <i className="bi bi-bag me-2"></i>
                  Commandes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/categories" className="nav-link text-white">
                  <i className="bi bi-list-check me-2"></i>
                  Catégories
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/reviews" className="nav-link text-white">
                  <i className="bi bi-star me-2"></i>
                  Avis
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/statistics" className="nav-link text-white">
                  <i className="bi bi-graph-up me-2"></i>
                  Statistiques
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/settings" className="nav-link text-white">
                  <i className="bi bi-gear me-2"></i>
                  Paramètres
                </Link>
              </li>
            </ul>

            <hr className="text-white" />
            
            <div className="dropdown">
              <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                <strong>{currentUser.prenom} {currentUser.nom}</strong>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a className="dropdown-item" href="#">Paramètres</a></li>
                <li><a className="dropdown-item" href="#">Profil</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Déconnexion</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Tableau de bord administrateur</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-download me-1"></i> Exporter
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-printer me-1"></i> Imprimer
                </button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-primary dropdown-toggle">
                <i className="bi bi-calendar3 me-1"></i> Cette semaine
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
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Utilisateurs</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.users}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-people-fill fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Revenus</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.revenue.toFixed(2)} €</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-currency-euro fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Commandes
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.orders}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-cart-fill fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Vendeurs en attente</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{pendingVendors.length}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-shop fs-2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Vendors Table */}
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Vendeurs en attente d'approbation</h6>
                  <Link to="/admin/vendeurs/pending" className="btn btn-sm btn-primary">
                    Voir tout
                  </Link>
                </div>
                <div className="card-body">
                  {pendingVendors.length === 0 ? (
                    <div className="text-center py-3">
                      <i className="bi bi-check-circle fs-1 text-success"></i>
                      <p className="mt-2">Aucun vendeur en attente d'approbation</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Boutique</th>
                            <th>Date d'inscription</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingVendors.map(vendor => (
                            <tr key={vendor.id}>
                              <td>{vendor.id}</td>
                              <td>{vendor.nom}</td>
                              <td>{vendor.nom_boutique}</td>
                              <td>{vendor.date}</td>
                              <td>
                                <button
                                  onClick={() => handleVendorApproval(vendor.id, true)}
                                  className="btn btn-sm btn-success me-1"
                                >
                                  <i className="bi bi-check-lg"></i> Approuver
                                </button>
                                <button
                                  onClick={() => handleVendorApproval(vendor.id, false)}
                                  className="btn btn-sm btn-danger"
                                >
                                  <i className="bi bi-x-lg"></i> Rejeter
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Utilisateurs récents</h6>
                  <Link to="/admin/utilisateurs" className="btn btn-sm btn-primary">
                    Voir tout
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Rôle</th>
                          <th>Date d'inscription</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nom}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'administrateur' ? 'bg-danger' : 
                                user.role === 'vendeur' ? 'bg-primary' : 
                                'bg-success'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{user.date}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <Link to={`/admin/utilisateurs/${user.id}`} className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <Link to={`/admin/utilisateurs/${user.id}/edit`} className="btn btn-sm btn-outline-warning">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button className="btn btn-sm btn-outline-danger">
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default AdminDashboard;