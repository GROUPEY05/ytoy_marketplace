// src/pages/Acheteur/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { toast } from 'react-hot-toast';
import OrderTable from '../OrderTable';
import Pagination from '../Pagination';
import Layout from '../Layout';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await orderService.getOrders('acheteur', page);
      console.log('Réponse des commandes:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setPagination({
          currentPage: response.data.current_page || 1,
          lastPage: response.data.last_page || 1,
          total: response.data.total || 0
        });
      } else {
        setOrders([]);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: 0
        });
        toast.error('Format de données invalide');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response || error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des commandes');
      setOrders([]);
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

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes commandes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historique de toutes vos commandes
          </p>
        </div>
        {orders.length === 0 ? (
          <div className="px-4 py-5 text-center">
            <p className="text-gray-500">Vous n'avez pas encore de commandes.</p>
            <button 
              onClick={() => window.location.href = '/acheteur/orders/new'}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Passer une commande
            </button>
          </div>
        ) : (
          <>
            <OrderTable orders={orders} linkPrefix="/acheteur/orders" />
            <div className="px-4 py-4">
              <Pagination 
                currentPage={pagination.currentPage} 
                lastPage={pagination.lastPage} 
                onPageChange={handlePageChange} 
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderList;