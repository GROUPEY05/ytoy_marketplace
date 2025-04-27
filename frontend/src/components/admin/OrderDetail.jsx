// src/pages/Admin/OrderDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '../../services/orderService';

import { formatDate, formatPrice } from '../../utils/formatUtils'
import { ORDER_STATUS } from '../../utils/constants'
import Layout from '../Layout'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrder(id)
      setOrder(response.data)
    } catch (err) {
      setError('Erreur lors du chargement des détails de la commande')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleStatusChange = async e => {
    const newStatus = e.target.value
    try {
      setUpdatingStatus(true)
      await orderService.updateOrderStatus(id, newStatus)
      setOrder({ ...order, status: newStatus })
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading)
    return (
      <Layout>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </Layout>
    )

  if (error || !order)
    return (
      <Layout>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error || "Cette commande n'existe pas ou a été supprimée"}
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'
        >
          Retour à la liste
        </button>
      </Layout>
    )

  return (
    <Layout>
      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Commande #{order.id}
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Créée le {formatDate(order.created_at)}
            </p>
          </div>
          <div className='flex items-center'>
            <span className='mr-2'>Statut:</span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
              className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              {Object.keys(ORDER_STATUS).map(status => (
                <option key={status} value={status}>
                  {ORDER_STATUS[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
          <h2 className='text-lg font-medium text-gray-900'>
            Informations client
          </h2>
          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <p className='text-sm font-medium text-gray-500'>Nom</p>
              <p className='mt-1 text-sm text-gray-900'>
                {order.utilisateur?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Email</p>
              <p className='mt-1 text-sm text-gray-900'>
                {order.utilisateur?.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Téléphone</p>
              <p className='mt-1 text-sm text-gray-900'>{order.phone}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Adresse</p>
              <p className='mt-1 text-sm text-gray-900'>{order.address}</p>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
          <h2 className='text-lg font-medium text-gray-900'>
            Articles commandés
          </h2>
          <table className='min-w-full divide-y divide-gray-200 mt-4'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Produit
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Prix unitaire
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Quantité
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {item.produit?.name || 'Produit supprimé'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatPrice(item.price)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {item.quantity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan='3'
                  className='px-6 py-4 text-sm font-medium text-gray-900 text-right'
                >
                  Total
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>
                  {formatPrice(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {order.notes && (
          <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
            <h2 className='text-lg font-medium text-gray-900'>Notes</h2>
            <p className='mt-2 text-sm text-gray-500'>{order.notes}</p>
          </div>
        )}

        {order.payment && (
          <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
            <h2 className='text-lg font-medium text-gray-900'>
              Informations de paiement
            </h2>
            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Méthode</p>
                <p className='mt-1 text-sm text-gray-900'>
                  {order.payment.method}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Référence</p>
                <p className='mt-1 text-sm text-gray-900'>
                  {order.payment.reference}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Date</p>
                <p className='mt-1 text-sm text-gray-900'>
                  {formatDate(order.payment.created_at)}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Statut</p>
                <p className='mt-1 text-sm text-gray-900'>
                  {order.payment.status}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='border-t border-gray-200 px-4 py-4'>
          <button
            onClick={() => navigate('/admin/orders')}
            className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'
          >
            Retour à la liste
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default OrderDetail
