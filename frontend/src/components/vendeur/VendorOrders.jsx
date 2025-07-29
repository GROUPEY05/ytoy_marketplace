import React, { useState, useEffect } from 'react'
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Spinner,
  Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { apiClient } from '../../services/api'
import VendeurSidebar from './VendeurSidebar'

const VendorOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage] = useState(10)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusOptions] = useState([
    { value: 'en_attente', label: 'En attente' },
    { value: 'validee', label: 'Validée' },
    { value: 'en_preparation', label: 'En préparation' },
    { value: 'expediee', label: 'Expédiée' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' }
  ])

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await apiClient.get('/vendor/orders')

      if (response.data && response.data.data) {
        setOrders(response.data.data) 
        setCurrentPage(response.data.current_page)
        setTotalPages(response.data.last_page)
      }

      setError('')
    } catch (err) {
      console.error('Erreur détaillée:', err)
      const errorMessage =
        err.response?.data?.message || err.message || 'Erreur inconnue'
      console.error("Message d'erreur:", errorMessage)
      console.error('Status:', err.response?.status)
      console.error('Headers:', err.response?.headers)
      console.error('Erreur lors du chargement des commandes', err)
      setError(
        'Impossible de charger vos commandes. Veuillez réessayer plus tard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const openStatusModal = order => {
    setSelectedOrder(order)
    setNewStatus(order.statut || 'en_attente')
    setShowStatusModal(true)
  }

  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      setLoading(true)
      await orderService.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        'vendeur'
      )

      // Mettre à jour l'état local
      setOrders(
        orders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, statut: newStatus }
            : order
        )
      )

      setShowStatusModal(false)
      setSelectedOrder(null)
      setError('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error)
      setError('Erreur lors de la mise à jour du statut de la commande')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = status => {
    switch (status) {
      case 'en_attente':
        return <Badge bg='warning'>En attente</Badge>
      case 'validee':
        return <Badge bg='info'>Validée</Badge>
      case 'en_preparation':
        return <Badge bg='primary'>En préparation</Badge>
      case 'expediee':
        return <Badge bg='success'>Expédiée</Badge>
      case 'livree':
        return <Badge bg='success'>Livrée</Badge>
      case 'annulee':
        return <Badge bg='danger'>Annulée</Badge>
      default:
        return <Badge bg='secondary'>{status}</Badge>
    }
  }

  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
  }

  return (
    <div className=' container-fluid py-4'>
      <div className='row'>
         {/* Sidebar */}
        <VendeurSidebar />
        <main  className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
      {error && <Alert variant='danger'>{error}</Alert>}

      {loading ? (
        <div className='text-center'>
          <Spinner animation='border' variant='primary' />
          <p className='mt-3'>Chargement des commandes...</p>
        </div>
      ) : (
        <div className='card shadow mb-4'>
          <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h2 className='mb-0'>Gestion des Commandes</h2>
              <Button
                variant='outline-primary'
                className='me-2'
                onClick={() => fetchOrders(currentPage)}
              >
                <i className='bi bi-arrow-clockwise me-1'></i>
                Rafraîchir
              </Button>
            </div>
            <div className='table-responsive'>
              <Table hover className='table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          {order.customer_nom} {order.customer_prenom}
                        </td>
                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td>{(order.montant_total || 0).toFixed(2)} FRCFA</td>
                        <td>
                          <Badge
                            bg={
                              order.statut === 'livree'
                                ? 'success'
                                : order.statut === 'expediee'
                                ? 'info'
                                : order.statut === 'en_preparation'
                                ? 'primary'
                                : order.statut === 'validee'
                                ? 'warning'
                                : order.statut === 'annulee'
                                ? 'danger'
                                : 'secondary'
                            }
                          >
                            {getStatusLabel(order.statut)}
                          </Badge>
                        </td>
                        <td className='d-flex gap-2'>
                          <Link
                            to={`/vendeur/orders/${order.id}`}
                            className='btn btn-sm btn-outline-primary me-1'
                          >
                            <i className='bi bi-eye'></i>
                          </Link>
                          <Button
                            variant='outline-success'
                            size='sm'
                            className='me-1'
                            onClick={() => openStatusModal(order)}
                          >
                            <i className='bi bi-pencil'></i>
                          </Button>
                          {/* <Button
                            variant='outline-secondary'
                            size='sm'
                            as={Link}
                            to={`/vendeur/invoices/${order.id}`}
                          >
                            <i className='bi bi-file-text'></i>
                          </Button> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>
                        Aucune commande trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {totalPages > 1 && (
                <div className='d-flex justify-content-center mt-4'>
                  <nav>
                    <ul className='pagination'>
                      <li
                        className={`page-item ${
                          currentPage === 1 ? 'disabled' : ''
                        }`}
                      >
                        <button
                          className='page-link'
                          onClick={() => fetchOrders(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${
                            currentPage === index + 1 ? 'active' : ''
                          }`}
                        >
                          <button
                            className='page-link'
                            onClick={() => fetchOrders(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? 'disabled' : ''
                        }`}
                      >
                        <button
                          className='page-link'
                          onClick={() => fetchOrders(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour le statut</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Commande #{selectedOrder?.id}</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowStatusModal(false)}>
            Annuler
          </Button>
          <Button variant='primary' onClick={updateOrderStatus}>
            Mettre à jour
          </Button>
        </Modal.Footer>
      </Modal>
      </main>
    </div>
    </div>
  )
}

export default VendorOrders
