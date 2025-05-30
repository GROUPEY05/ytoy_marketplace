// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { adminService } from '../../services/api'
import { Home } from "lucide-react"

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const defaultStats = {
    utilisateurs: {
      total: 0,
      acheteurs: 0,
      vendeurs: 0,
      admins: 0,
      nouveaux_aujourdhui: 0,
      actifs: 0,
      inactifs: 0
    },
    vendeurs: {
      total: 0,
      en_attente: 0,
      verifies: 0,
      actifs: 0,
      suspendus: 0
    },
    produits: {
      total: 0,
      actifs: 0,
      inactifs: 0,
      rupture_stock: 0,
      par_categorie: {}
    },
    commandes: {
      total: 0,
      aujourd_hui: 0,
      en_attente: 0,
      en_cours: 0,
      expediees: 0,
      livrees: 0,
      annulees: 0,
      montant_total: 0,
      montant_aujourd_hui: 0,
      total_revenue: 0
    }
  }

  const [stats, setStats] =useState({
      utilisateurs: 0,
      revenue: 0,
      products: 0,
      orders: 0,
      pending_orders: 0
    })
  const [pendingVendors, setPendingVendors] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)


    // Charger les données réelles depuis l'API
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Récupérer les commandes récentes - essayer plusieurs routes possibles
          let usersData = [];
          
          try {
            // Essayer d'abord avec la route acheteur/orders
            const usersResponse = await adminService.getUsers(currentPage, selectedRole, searchTerm);
            if (usersResponse.data && Array.isArray(usersResponse.data)) {
              usersData = usersResponse.data;
            }
          } catch (orderError) {
            console.log('Erreur avec la première route, essai avec une autre route');
            // try {
            //   // Essayer ensuite avec la route panier/orders
            //   const ordersResponse = await apiClient.get('/api/panier/orders');
            //   if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
            //     ordersData = ordersResponse.data;
            //   }
            // } catch (secondError) {
            //   console.log('Erreur avec la deuxième route aussi');
            // }
          }
          
          setRecentUsers(usersData.slice(0, 3)); // Limiter aux 3 plus récentes
          
          // Pour la liste de souhaits et les avis, utiliser des valeurs par défaut
          // car ces routes ne semblent pas exister dans le backend
          setWishlistCount(0);
          setReviewsCount(0);
          
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          // En cas d'erreur, utiliser des données par défaut
          setRecentUsers([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);

  // useEffect(() => {
  //   fetchData()
  // }, [])

  // const fetchData = async () => {
  //   try {
  //     setLoading(true)
      
  //     // Récupérer les données du dashboard
  //     const response = await apiClient.get('/api/admin/dashboard')
      
  //     if (response.data.success) {
  //       const {
  //         stats,
  //         commandes_recentes,
  //         vendeurs_en_attente,
  //         utilisateurs_recents,
  //         produits_recents
  //       } = response.data.data

  //       // Mise à jour des statistiques
  //       setStats({
  //         utilisateurs:response.data.total_utilisateurs || {},
  //         vendeurs: stats.vendeurs || {},
  //         produits: stats.produits || {},
  //         commandes: stats.commandes || {}
  //       })

  //       // Mise à jour des commandes récentes
  //       setOrders(commandes_recentes.map(commande => ({
  //         id: commande.id,
  //         client: commande.client,
  //         montant_total: commande.montant_total,
  //         status: commande.status,
  //         date: new Date(commande.created_at).toLocaleDateString('fr-FR', {
  //           day: '2-digit',
  //           month: '2-digit',
  //           year: 'numeric',
  //           hour: '2-digit',
  //           minute: '2-digit'
  //         }),
  //         produits: commande.produits || []
  //       })))

  //       // Mise à jour des vendeurs en attente
  //       setPendingVendors(vendeurs_en_attente.map(vendeur => ({
  //         id: vendeur.id,
  //         nom: vendeur.nom,
  //         prenom: vendeur.prenom,
  //         email: vendeur.email,
  //         telephone: vendeur.telephone,
  //         boutique: vendeur.boutique,
  //         date_inscription: new Date(vendeur.created_at).toLocaleDateString('fr-FR', {
  //           day: '2-digit',
  //           month: '2-digit',
  //           year: 'numeric'
  //         })
  //       })))

  //       // Mise à jour des utilisateurs récents
  //       setRecentUsers(utilisateurs_recents || [])
  //     } else {
  //       toast.error(response.data.message || 'Une erreur est survenue lors du chargement des données')
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des données:', error)
  //     if (error.response?.status === 401) {
  //       toast.error('Session expirée. Veuillez vous reconnecter.')
  //       handleLogout()
  //     } else if (error.response?.status === 403) {
  //       toast.error('Vous n\'avez pas les droits nécessaires pour accéder à cette page')
  //       navigate('/')
  //     } else {
  //       toast.error('Erreur lors du chargement des données du tableau de bord')
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleVendorApproval = async (vendorId, approved) => {
    try {
      const endpoint = approved ? 'approuver' : 'rejeter';
      const response = await apiClient.post(`/api/admin/vendeurs/${vendorId}/${endpoint}`)
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchData()
      } else {
        toast.error(response.data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du vendeur:', error)
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.')
        handleLogout()
      } else if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas les droits nécessaires pour effectuer cette action')
      } else {
        toast.error('Erreur lors de la mise à jour du statut du vendeur')
      }
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await apiClient.put(`/api/admin/commandes/${orderId}/status`, { status })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Statut de la commande mis à jour avec succès')
        fetchData()
      } else {
        toast.error(response.data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.')
        handleLogout()
      } else if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas les droits nécessaires pour effectuer cette action')
      } else {
        toast.error('Erreur lors de la mise à jour du statut de la commande')
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'livré':
        return 'bg-success'
      case 'en_cours':
      case 'en_attente':
        return 'bg-warning'
      case 'annulé':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid4'>
      <div className='row'>
        {/* Sidebar */}
        <nav
          id='sidebarMenu'
          className='col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse'
        >
          <div className='position-sticky pt-3'>
            <div className='d-flex align-items-center pb-3 mb-3 text-white text-decoration-none border-bottom'>
              <span className='fs-5 fw-semibold'>Administration</span>
            </div>
            <div className="sidebar-sticky">
              <ul className="nav flex-column">

              <li className='nav-item'>
                <Link
                  to='/'
                  className='nav-link text-white'
                >
                  <Home className='me-2' style={{ fontSize: '10px'}} />
                  Accueil
                </Link>
              </li>
                <li className="nav-item">

                
                  <Link to="/admin" className="nav-link text-white active">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/products-management" className="nav-link text-white">
                    <i className="bi bi-box me-2"></i>
                    Produits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/users" className="nav-link text-white">
                    <i className="bi bi-people me-2"></i>
                    Utilisateurs
                  </Link>
                </li>
                <li className='nav-item'>
                <Link to='/admin/categories' className='nav-link text-white'>
                  <i className='bi bi-list-check me-2'></i>
                  Catégories
                </Link>
              </li>
                <li className="nav-item">
                  <Link to="/admin/vendors" className="nav-link text-white">
                    <i className="bi bi-shop me-2"></i>
                    Vendeurs
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link to="/admin/orders" className="nav-link text-white">
                    <i className="bi bi-cart me-2"></i>
                    Commandes
                  </Link>
                </li>
                

               
              <li className='nav-item'>
                <Link to='/admin/reviews' className='nav-link text-white'>
                  <i className='bi bi-star me-2'></i>
                  Avis
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/admin/statistics' className='nav-link text-white'>
                  <i className='bi bi-graph-up me-2'></i>
                  Statistiques
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/admin/settings' className='nav-link text-white'>
                  <i className='bi bi-gear me-2'></i>
                  Paramètres
                </Link>
              </li>
              <div className='nav-item mt-4'>
                <button
                  onClick={handleLogout}
                  className='nav-link text-danger border-0 bg-transparent d-flex align-items-center'
                >
                  <i className='bi bi-box-arrow-right me-2'></i>
                  Déconnexion
                </button>
              </div>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
            <h1 className='h2'>Tableau de bord administrateur</h1>
            <div className='btn-toolbar mb-2 mb-md-0'>
              <div className='btn-group me-2'>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-secondary'
                >
                  <i className='bi bi-download me-1'></i> Exporter
                </button>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-secondary'
                >
                  <i className='bi bi-printer me-1'></i> Imprimer
                </button>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-outline-primary dropdown-toggle'
              >
                <i className='bi bi-calendar3 me-1'></i> Cette semaine
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='row mb-4'>
            <div className='col-xl-3 col-md-6 mb-4'>
              <div className='card border-left-primary shadow h-100 py-2'>
                <div className='card-body'>
                  <div className='row no-gutters align-items-center'>
                    <div className='col mr-2'>
                      <div className='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                        Utilisateurs
                      </div>
                      <div className='h5 mb-0 font-weight-bold text-gray-800'>
                        {recentUsers.length}
                      </div>
                    </div>
                    <div className='col-auto'>
                      <i className='bi bi-people-fill fs-2 text-gray-300'></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-xl-3 col-md-6 mb-4'>
              <div className='card border-left-success shadow h-100 py-2'>
                <div className='card-body'>
                  <div className='row no-gutters align-items-center'>
                    <div className='col mr-2'>
                      <div className='text-xs font-weight-bold text-success text-uppercase mb-1'>
                        Revenus
                      </div>
                      <div className='h5 mb-0 font-weight-bold text-gray-800'>
                        {(stats.commandes?.montant_total || 0).toFixed(2)} francs
                      </div>
                    </div>
                    <div className='col-auto'>
                      {/* <i className='bi bi-currency-euro fs-2 text-gray-300'></i> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-xl-3 col-md-6 mb-4'>
              <div className='card border-left-info shadow h-100 py-2'>
                <div className='card-body'>
                  <div className='row no-gutters align-items-center'>
                    <div className='col mr-2'>
                      <div className='text-xs font-weight-bold text-info text-uppercase mb-1'>
                        Commandes
                      </div>
                      <div className='h5 mb-0 font-weight-bold text-gray-800'>
                        {stats.commandes?.total || 0}
                      </div>
                    </div>
                    <div className='col-auto'>
                      <i className='bi bi-cart-fill fs-2 text-gray-300'></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-xl-3 col-md-6 mb-4'>
              <div className='card border-left-warning shadow h-100 py-2'>
                <div className='card-body'>
                  <div className='row no-gutters align-items-center'>
                    <div className='col mr-2'>
                      <div className='text-xs font-weight-bold text-warning text-uppercase mb-1'>
                        Vendeurs en attente
                      </div>
                      <div className='h5 mb-0 font-weight-bold text-gray-800'>
                        {pendingVendors.length}
                      </div>
                    </div>
                    <div className='col-auto'>
                      <i className='bi bi-shop fs-2 text-gray-300'></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Vendors Table */}
          <div className='card shadow mb-4'>
            <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
              <h6 className='m-0 font-weight-bold text-primary'>
                Vendeurs en attente d'approbation
              </h6>
              <Link
                to='/admin/vendeurs/pending'
                className='btn btn-sm btn-primary'
              >
                Voir tout
              </Link>
            </div>
            <div className='card-body'>
              {pendingVendors.length === 0 ? (
                <div className='text-center py-3'>
                  <i className='bi bi-check-circle fs-1 text-success'></i>
                  <p className='mt-2'>
                    Aucun vendeur en attente d'approbation
                  </p>
                </div>
              ) : (
                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    <thead className='table-light'>
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
                              onClick={() =>
                                handleVendorApproval(vendor.id, true)
                              }
                              className='btn btn-sm btn-success me-1'
                            >
                              <i className='bi bi-check-lg'></i> Approuver
                            </button>
                            <button
                              onClick={() =>
                                handleVendorApproval(vendor.id, false)
                              }
                              className='btn btn-sm btn-danger'
                            >
                              <i className='bi bi-x-lg'></i> Rejeter
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
          <div className='card shadow mb-4'>
            <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
              <h6 className='m-0 font-weight-bold text-primary'>
                Utilisateurs récents
              </h6>
              <Link
                to='/admin/utilisateurs'
                className='btn btn-sm btn-primary'
              >
                Voir tout
              </Link>
            </div>
            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                  <thead className='table-light'>
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
                          <span
                            className={`badge ${
                              user.role === 'administrateur'
                                ? 'bg-danger'
                                : user.role === 'vendeur'
                                ? 'bg-primary'
                                : 'bg-success'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{user.date}</td>
                        <td>
                          <div className='btn-group' role='group'>
                            <Link
                              to={`/admin/utilisateurs/${user.id}`}
                              className='btn btn-sm btn-outline-primary'
                            >
                              <i className='bi bi-eye'></i>
                            </Link>
                            <Link
                              to={`/admin/utilisateurs/${user.id}/edit`}
                              className='btn btn-sm btn-outline-warning'
                            >
                              <i className='bi bi-pencil'></i>
                            </Link>
                            <button className='btn btn-sm btn-outline-danger'>
                              <i className='bi bi-trash'></i>
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

          {/* Statistiques des commandes */}
          <div className="row mb-4">
            <div className="col-12 mb-3">
              <h4>Statistiques des commandes</h4>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total commandes
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.commandes?.total || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-cart4 fs-2 text-gray-300"></i>
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
                        Montant total
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {(stats.commandes?.montant_total || 0).toFixed(2)} €
                      </div>
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
                        Commandes aujourd'hui
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.commandes?.aujourd_hui || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-calendar-check fs-2 text-gray-300"></i>
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
                        En attente
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.commandes?.en_attente || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-hourglass fs-2 text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des commandes récentes */}
          <div className='card shadow mb-4'>
            <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
              <h6 className='m-0 font-weight-bold text-primary'>
                Commandes récentes
              </h6>
              <Link to='/admin/commandes' className='btn btn-sm btn-primary'>
                Voir tout
              </Link>
            </div>
            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                  <thead className='table-light'>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Produits</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          {order.client ? (
                            <>
                              {order.client.nom} {order.client.prenom}<br />
                              <small className="text-muted">{order.client.email}</small>
                            </>
                          ) : (
                            'Client inconnu'
                          )}
                        </td>
                        <td>{order.montant_total} €</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {order.produits.map(produit => (
                              <li key={produit.id}>
                                {produit.nom} x{produit.quantite} ({produit.prix_unitaire} €)
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <div className='btn-group' role='group'>
                            <Link
                              to={`/admin/commandes/${order.id}`}
                              className='btn btn-sm btn-outline-primary'
                              title="Voir les détails"
                            >
                              <i className='bi bi-eye'></i>
                            </Link>
                            <button
                              className='btn btn-sm btn-outline-success'
                              onClick={() => handleStatusChange(order.id, 'livre')}
                              title="Marquer comme livrée"
                            >
                              <i className='bi bi-check-lg'></i>
                            </button>
                            <button
                              className='btn btn-sm btn-outline-danger'
                              onClick={() => handleStatusChange(order.id, 'annule')}
                              title="Annuler la commande"
                            >
                              <i className='bi bi-x-lg'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Vendeurs en attente */}
            <div className='card shadow mb-4'>
              <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
                <h6 className='m-0 font-weight-bold text-primary'>
                  Vendeurs en attente d'approbation
                </h6>
                <Link to='/admin/vendeurs' className='btn btn-sm btn-primary'>
                  Voir tous les vendeurs
                </Link>
              </div>
              <div className='card-body'>
                {pendingVendors.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle text-success fs-1"></i>
                    <p className="mt-2 mb-0">Aucun vendeur en attente d'approbation</p>
                  </div>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-bordered'>
                      <thead className='table-light'>
                        <tr>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                          <th>Boutique</th>
                          <th>Date d'inscription</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingVendors.map(vendor => (
                          <tr key={vendor.id}>
                            <td>
                              {vendor.nom} {vendor.prenom}
                            </td>
                            <td>{vendor.email}</td>
                            <td>{vendor.telephone}</td>
                            <td>
                              {vendor.boutique ? (
                                <>
                                  <strong>{vendor.boutique.nom}</strong><br />
                                  <small>{vendor.boutique.ville}</small>
                                  {vendor.boutique.siret && (
                                    <div className="small text-muted mt-1">
                                      SIRET: {vendor.boutique.siret}
                                    </div>
                                  )}
                                </>
                              ) : (
                                'Non renseigné'
                              )}
                            </td>
                            <td>{vendor.date_inscription}</td>
                            <td>
                              <div className='btn-group' role='group'>
                                <button
                                  className='btn btn-sm btn-outline-success'
                                  onClick={() => handleVendorApproval(vendor.id, true)}
                                  title="Approuver le vendeur"
                                >
                                  <i className='bi bi-check-lg'></i>
                                </button>
                                <button
                                  className='btn btn-sm btn-outline-danger'
                                  onClick={() => handleVendorApproval(vendor.id, false)}
                                  title="Rejeter le vendeur"
                                >
                                  <i className='bi bi-x-lg'></i>
                                </button>
                                <Link
                                  to={`/admin/vendeurs/${vendor.id}`}
                                  className='btn btn-sm btn-outline-primary'
                                  title="Voir les détails"
                                >
                                  <i className='bi bi-eye'></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
