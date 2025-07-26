import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import Layout from '../Layout';
import AdminSidebar from './AdminSidebar'

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getOrders(page);
      setOrders(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page
      });
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger" role="alert">{error}</div>
      </Layout>
    );
  }

  return (
    <div className='container-fluid4 '>
      <div className='row'>
        {/* Sidebar */}
        <AdminSidebar />

       
          
              <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                <div className='container mt-4'>
                  <h2>Toutes les commandes</h2>
                  <p className='text-muted mb-4'>Liste complète des commandes de la plateforme</p>

                  {orders.length === 0 ? (
                    <div className="alert alert-info">Aucune commande trouvée sur la plateforme.</div>
                  ) : (
                    <div className='table-responsive'>
                      <table className='table table-striped'>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.utilisateur ? `${order.utilisateur.nom} ${order.utilisateur.prenom}` : 'N/A'}</td>
                              <td>{new Date(order.date_commande).toLocaleDateString('fr-FR')}</td>
                              <td>{Number(order.montant_total).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} FCFA</td>
                              <td>{order.statut}</td>
                              <td>
                                <Link to={`/admin/orders/${order.id}`} className='btn btn-sm btn-outline-primary'>
                                  Détails
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination (assurez-vous d'avoir le composant Pagination au besoin) */}
                  {/* <Pagination
                  currentPage={pagination.currentPage}
                  lastPage={pagination.lastPage}
                  onPageChange={handlePageChange}
                /> */}
                </div>
              </main>
            
       

      </div>
    </div>
  );
};

export default OrderList;
