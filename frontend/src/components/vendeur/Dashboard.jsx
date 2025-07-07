// src/components/vendeur/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient } from '../../services/api'
import { Home } from "lucide-react";
import VendeurSidebar from './VendeurSidebar'


const VendeurDashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  // Initialiser les stats avec des valeurs par défaut pour éviter les erreurs undefined
  const [stats, setStats] = useState({
    sales: 0,
    revenue: 0,
    products: 0,
    orders: 0,
    pending_orders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      alert('Erreur lors de la déconnexion. Veuillez réessayer.')
    }  finally {
      // Nettoyer complètement le localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Réinitialiser l'état
      setCurrentUser(null);
      setIsAuthenticated(false);
      
    }
  }

  // Charger les données réelles depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les statistiques du vendeur
        try {
          console.log('Tentative de récupération des statistiques du vendeur...');
          const statsResponse = await apiClient.get('/api/vendor/stats')
          console.log('Réponse des statistiques:', statsResponse.data);
          
          // Si la réponse contient les statistiques, les utiliser
          if (statsResponse.data) {
            setStats({
              sales: statsResponse.data.total_orders || 0,
              revenue: statsResponse.data.total_revenue || 0,
              products: statsResponse.data.total_products || 0,
              orders: statsResponse.data.total_orders || 0,
              pending_orders: statsResponse.data.pending_orders || 0
            })
          }
        } catch (statsError) {
          console.error('Erreur lors du chargement des statistiques:', statsError)
          // Utiliser des données par défaut en cas d'erreur
          setStats({
            sales: 0,
            revenue: 0,
            products: 0,
            orders: 0,
            pending_orders: 0
          })
        }
        
        // Récupérer les commandes récentes
        try {
          console.log('Tentative de récupération des commandes récentes...');
          const ordersResponse = await apiClient.get('api/vendor/recent-orders?per_page=3&sort_by=created_at&sort_direction=desc')
          console.log('Réponse des commandes récentes:', ordersResponse.data);
        
          if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
            // Les données sont déjà formatées par le backend
            setRecentOrders(ordersResponse.data)
          }
        } catch (ordersError) {
          console.error('Erreur lors du chargement des commandes:', ordersError)
          setRecentOrders([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // En cas d'erreur, utiliser des données par défaut
        setStats({
          sales: 0,
          revenue: 0,
          products: 0,
          orders: 0
        })
        setRecentOrders([])
      } finally {
        setLoading(false)
      }
    }
    
    // Fonction pour obtenir le libellé du statut
    const getStatusLabel = (statut) => {
      switch (statut) {
        case 'en_attente': return 'En attente'
        case 'validee': return 'Validée'
        case 'en_preparation': return 'En préparation'
        case 'expediee': return 'Expédiée'
        case 'livree': return 'Livrée'
        case 'annulee': return 'Annulée'
        default: return statut
      }
    }
    
    fetchData()
  }, [])

  // Marque une commande comme expédiée
  const handleShip = async (orderId) => {
    try {
      await apiClient.put(`/api/vendor/orders/${orderId}/status`, { status: 'expediee' });
      setRecentOrders(recentOrders.map(o => o.id === orderId ? { ...o, status: 'Expédiée' } : o));
    } catch (error) {
      console.error('Erreur lors du changement de statut de la commande', error);
    }
  };

  return (
    <div className='container-fluid4 mt-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar  />

        {/* Main content */}
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
            <h1 className='h2'>Tableau de bord Vendeur</h1>
            <div className='btn-toolbar mb-2 mb-md-0'>
              <div className='btn-group me-2'>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-secondary'
                >
                  Exporter
                </button>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-secondary'
                >
                  Imprimer
                </button>
              </div>
              <button type='button' className='btn btn-sm ' style={{ backgroundColor: '#FF6F00', color: 'white' }}>
                <i className='bi bi-plus'></i>{' '}
                <a
                  href='/vendeur/products/add'
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  Ajouter un produit
                </a>
              </button>
              
            </div>
          </div>

          {loading ? (
            <div className='text-center py-5'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Chargement...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className='row mb-4'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card border-left-primary shadow h-100 py-2'>
                    <div className='card-body'>
                      <div className='row no-gutters align-items-center'>
                        <div className='col mr-2'>
                          <div className='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                            Ventes (Mensuel)
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats?.sales || 0}
                          </div>
                        </div>
                        <div className='col-auto'>
                          <i className='bi bi-cart fs-2 text-gray-300'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6'>
                  <div className='card border-left-success shadow h-100 py-2'>
                    <div className='card-body'>
                      <div className='row no-gutters align-items-center'>
                        <div className='col mr-2'>
                          <div className='text-xs font-weight-bold text-success text-uppercase mb-1'>
                            Revenus (Mensuel)
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {(stats.revenue || 0).toFixed(2)} Francs
                          </div>
                        </div>
                        <div className='col-auto'>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6'>
                  <div className='card border-left-info shadow h-100 py-2'>
                    <div className='card-body'>
                      <div className='row no-gutters align-items-center'>
                        <div className='col mr-2'>
                          <div className='text-xs font-weight-bold text-info text-uppercase mb-1'>
                            Produits
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats?.products || 0}
                          </div>
                        </div>
                        <div className='col-auto'>
                          <i className='bi bi-box fs-2 text-gray-300'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6'>
                  <div className='card border-left-warning shadow h-100 py-2'>
                    <div className='card-body'>
                      <div className='row no-gutters align-items-center'>
                        <div className='col mr-2'>
                          <div className='text-xs font-weight-bold text-warning text-uppercase mb-1'>
                            Commandes en attente
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats?.pending_orders || 0}
                          </div>
                        </div>
                        <div className='col-auto'>
                          <i className='bi bi-clock fs-2 text-gray-300'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders table */}
              <div className='card shadow mb-4'>
                <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
                  <h6 className='m-0 font-weight-bold text-primary'>
                    Commandes récentes
                  </h6>
                  <Link to='/vendeur/orders' className='btn btn-sm btn-primary'>
                    Voir tout
                  </Link>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    <table className='table table-bordered table-hover'>
                      <thead className='table-light'>
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
                        {recentOrders && recentOrders.length > 0 ? recentOrders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer_nom}</td>
                            <td>{new Date(order.date_commande || order.created_at).toLocaleDateString()}</td>
                             <td>
                            <span className={`badge ${
                              order.statut === 'livree' ? 'bg-success' : 
                              order.statut === 'expediee' ? 'bg-primary' : 
                              order.statut === 'validee' ? 'bg-info' : 
                              order.statut === 'annulee' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {order.statut === 'en_attente' ? 'En attente' :
                               order.statut === 'validee' ? 'Validée' :
                               order.statut === 'en_preparation' ? 'En préparation' :
                               order.statut === 'expediee' ? 'Expédiée' :
                               order.statut === 'livree' ? 'Livrée' :
                               order.statut === 'annulee' ? 'Annulée' : order.statut}
                            </span>
                          </td>
                            <td>{order.montant_total} FCFA</td>
                            <td>
                              <Link
                                to={`/vendeur/orders/${order.id}`}
                                className='btn btn-sm btn-outline-primary me-1'
                              >
                                <i className='bi bi-eye'></i>
                              </Link>
                              <button
                                className='btn btn-sm btn-outline-success'
                                onClick={() => handleShip(order.id)}
                              >
                                <i className='bi bi-truck'></i>
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="6" className="text-center">Aucune commande récente</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Tips */}
              <div className='row'>
                <div className='col-lg-6'>
                  <div className='card shadow mb-4'>
                    <div className='card-header py-3'>
                      <h6 className='m-0 font-weight-bold text-primary'>
                        Actions rapides
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6 mb-3'>
                          <Link
                            to='/vendeur/products/add'
                            className='btn btn-success btn-block w-100'
                          >
                            <i className='bi bi-plus-circle me-2'></i>Ajouter un
                            produit
                          </Link>
                        </div>
                        <div className='col-6 mb-3'>
                          <Link
                            to='/vendeur/orders'
                            className='btn btn-warning w-100'
                          >
                            <i className='bi bi-clock me-2'></i>Commandes en
                            attente
                          </Link>
                        </div>
                        <div className='col-6 mb-3'>
                          <Link
                            to='/vendeur/promotions'
                            className='btn btn-info btn-block w-100'
                          >
                            <i className='bi bi-tag me-2'></i>Créer une
                            promotion
                          </Link>
                        </div>
                        <div className='col-6 mb-3'>
                          <Link
                            to='/vendeur/products'
                            className='btn btn-secondary w-100'
                          >
                            <i className='bi bi-list-check me-2'></i>Gérer le
                            stock
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='card shadow mb-4'>
                    <div className='card-header py-3'>
                      <h6 className='m-0 font-weight-bold text-primary'>
                        Astuces pour les vendeurs
                      </h6>
                    </div>
                    <div className='card-body'>
                      <ul className='list-unstyled'>
                        <li className='mb-2'>
                          <i className='bi bi-check-circle text-success me-2'></i>
                          Utilisez des photos de qualité pour vos produits
                        </li>
                        <li className='mb-2'>
                          <i className='bi bi-check-circle text-success me-2'></i>
                          Répondez rapidement aux questions des clients
                        </li>
                        <li className='mb-2'>
                          <i className='bi bi-check-circle text-success me-2'></i>
                          Maintenez votre inventaire à jour
                        </li>
                        <li className='mb-2'>
                          <i className='bi bi-check-circle text-success me-2'></i>
                          Offrez des promotions saisonnières pour attirer plus
                          de clients
                        </li>
                        <li>
                          <i className='bi bi-check-circle text-success me-2'></i>
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
  )
}

export default VendeurDashboard
