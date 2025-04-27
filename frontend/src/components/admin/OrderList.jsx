// src/pages/Admin/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import OrderTable from '../OrderTable';
import Pagination from '../Pagination';
import Layout from '../Layout';

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
      const response = await orderService.getOrders(page);
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
          <h1 className="text-2xl font-bold text-gray-900">Toutes les commandes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Liste complète des commandes de la plateforme
          </p>
        </div>
        <OrderTable orders={orders} linkPrefix="/admin/orders" />
        <div className="px-4 py-4">
          <Pagination 
            currentPage={pagination.currentPage} 
            lastPage={pagination.lastPage} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default OrderList;