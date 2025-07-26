import React, { useState, useEffect } from 'react'
import {
  Plus,
  Eye,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import VendeurSidebar from './VendeurSidebar'

const VendorCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [token, setToken] = useState('demo-token') // Remplace localStorage

  useEffect(() => {
    // Simule des données de campagnes pour la démonstration
    const mockCampaigns = [
      {
        id: 1,
        title: 'Campagne saison sèche 2024',
        description:
          "Promotion des produits de saison pour l'été avec offres spéciales",
        budget: 150000,
        target_platforms: ['Facebook', 'Instagram'],
        status: 'active',
        created_at: '2024-06-15T10:30:00Z',
        admin_notes: 'Campagne approuvée après révision du contenu',
        product_descriptions: [
          'Maillot de bain femme haute qualité',
          'Lunettes de soleil polarisées'
        ],
        product_prices: [25000, 15000],
        product_images: ['product1.jpg', 'product2.jpg']
      },
      {
        id: 2,
        title: 'Lancement Nouvelle Collection',
        description:
          'Introduction de notre nouvelle gamme de vêtements urbains',
        budget: 200000,
        target_platforms: ['Instagram', 'TikTok'],
        status: 'pending',
        created_at: '2024-07-01T14:15:00Z',
        admin_notes: null,
        product_descriptions: [
          'Sneakers édition limitée',
          'T-shirt streetwear premium',
          'Casquette brodée'
        ],
        product_prices: [45000, 18000, 12000],
        product_images: ['sneakers.jpg', 'tshirt.jpg', 'cap.jpg']
      },
      {
        id: 3,
        title: 'Promo Rentrée Scolaire',
        description: 'Offres spéciales pour la rentrée des classes',
        budget: 80000,
        target_platforms: ['Facebook', 'Twitter'],
        status: 'completed',
        created_at: '2024-08-20T09:00:00Z',
        admin_notes: 'Campagne terminée avec succès',
        product_descriptions: ['Sac à dos étudiant', 'Cahiers et fournitures'],
        product_prices: [22000, 8000],
        product_images: ['backpack.jpg', 'supplies.jpg']
      }
    ]

    // Simule un appel API
    setTimeout(() => {
      setCampaigns(mockCampaigns)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = status => {
    const badges = {
      pending: {
        class: 'bg-warning text-dark',
        text: 'En attente',
        icon: Clock
      },
      approved: { class: 'bg-success', text: 'Approuvée', icon: CheckCircle },
      rejected: { class: 'bg-danger', text: 'Rejetée', icon: XCircle },
      active: { class: 'bg-info', text: 'Active', icon: BarChart3 },
      completed: { class: 'bg-secondary', text: 'Terminée', icon: CheckCircle }
    }
    return badges[status] || badges['pending']
  }

  const viewCampaign = campaign => {
    setSelectedCampaign(campaign)
    setShowModal(true)
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className='container-fluid py-4'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar />
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          {/* Header */}
          <div className='row mb-4'>
            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <h1 className='h3 mb-0'>Mes Campagnes Marketing</h1>
                  <p className='text-muted'>
                    Gérez vos campagnes publicitaires et suivez leurs
                    performances
                  </p>
                </div>
                <button
                  className='btn btn-success btn-lg'
                  onClick={() => alert('Redirection vers /campaigns/create')}
                >
                  <Plus className='me-2' size={20} />
                  Nouvelle Campagne
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className='row mb-4'>
            <div className='col-md-3'>
              <div className='card bg-secondary text-white'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className='mb-0'>{campaigns.length}</h4>
                      <p className='mb-0'>Total campagnes</p>
                    </div>
                    <Target size={32} className='opacity-75' />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='card bg-success text-white'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className='mb-0'>
                        {campaigns.filter(c => c.status === 'active').length}
                      </h4>
                      <p className='mb-0'>Campagnes actives</p>
                    </div>
                    <BarChart3 size={32} className='opacity-75' />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='card bg-warning text-white'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className='mb-0'>
                        {campaigns.filter(c => c.status === 'pending').length}
                      </h4>
                      <p className='mb-0'>En attente</p>
                    </div>
                    <Clock size={32} className='opacity-75' />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='card bg-info text-white'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className='mb-0'>
                        {formatCurrency(
                          campaigns.reduce(
                            (sum, c) => sum + parseFloat(c.budget || 0),
                            0
                          )
                        )}
                      </h4>
                      <p className='mb-0'>Budget total</p>
                    </div>
                    <DollarSign size={32} className='opacity-75' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des campagnes */}
          <div className='row'>
            <div className='col-12'>
              <div className='card shadow-sm'>
                <div className='card-header bg-light'>
                  <h5 className='mb-0'>Toutes les campagnes</h5>
                </div>
                <div className='card-body p-0'>
                  {campaigns.length === 0 ? (
                    <div className='text-center py-5'>
                      <Target size={64} className='text-muted mb-3' />
                      <h5 className='text-muted'>Aucune campagne créée</h5>
                      <p className='text-muted'>
                        Commencez par créer votre première campagne marketing
                      </p>
                      <button
                        className='btn btn-primary'
                        onClick={() =>
                          alert('Redirection vers /campaigns/create')
                        }
                      >
                        <Plus className='me-2' size={16} />
                        Créer une campagne
                      </button>
                    </div>
                  ) : (
                    <div className='table-responsive'>
                      <table className='table table-hover mb-0'>
                        <thead className='table-light'>
                          <tr>
                            <th>Campagne</th>
                            <th>Budget</th>
                            <th>Plateformes</th>
                            <th>Statut</th>
                            <th>Date de création</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.map(campaign => {
                            const statusBadge = getStatusBadge(campaign.status)
                            const StatusIcon = statusBadge.icon

                            return (
                              <tr key={campaign.id}>
                                <td>
                                  <div>
                                    <h6 className='mb-1'>{campaign.title}</h6>
                                    <small className='text-muted'>
                                      {campaign.description?.substring(0, 50)}
                                      ...
                                    </small>
                                  </div>
                                </td>
                                <td>
                                  <strong>
                                    {formatCurrency(campaign.budget)}
                                  </strong>
                                </td>
                                <td>
                                  <div className='d-flex gap-1 flex-wrap'>
                                    {campaign.target_platforms?.map(
                                      platform => (
                                        <span
                                          key={platform}
                                          className='badge bg-light text-dark'
                                        >
                                          {platform}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${statusBadge.class}`}
                                  >
                                    <StatusIcon size={12} className='me-1' />
                                    {statusBadge.text}
                                  </span>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <Calendar
                                      size={14}
                                      className='me-1 text-muted'
                                    />
                                    {formatDate(campaign.created_at)}
                                  </div>
                                </td>
                                <td>
                                  <button
                                    className='btn btn-sm btn-outline-primary'
                                    onClick={() => viewCampaign(campaign)}
                                  >
                                    <Eye size={14} className='me-1' />
                                    Voir
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal de détails */}
          {showModal && selectedCampaign && (
            <div
              className='modal fade show'
              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title'>{selectedCampaign.title}</h5>
                    <button
                      type='button'
                      className='btn-close'
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className='modal-body'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='mb-3'>
                          <label className='form-label fw-bold'>
                            Description
                          </label>
                          <p className='form-control-plaintext'>
                            {selectedCampaign.description}
                          </p>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label fw-bold'>Budget</label>
                          <p className='form-control-plaintext text-success'>
                            {formatCurrency(selectedCampaign.budget)}
                          </p>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label fw-bold'>
                            Plateformes ciblées
                          </label>
                          <div className='d-flex gap-2 flex-wrap'>
                            {selectedCampaign.target_platforms?.map(
                              platform => (
                                <span
                                  key={platform}
                                  className='badge bg-primary'
                                >
                                  {platform}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='mb-3'>
                          <label className='form-label fw-bold'>Statut</label>
                          <div>
                            {(() => {
                              const statusBadge = getStatusBadge(
                                selectedCampaign.status
                              )
                              const StatusIcon = statusBadge.icon
                              return (
                                <span
                                  className={`badge ${statusBadge.class} fs-6`}
                                >
                                  <StatusIcon size={16} className='me-1' />
                                  {statusBadge.text}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label fw-bold'>
                            Date de création
                          </label>
                          <p className='form-control-plaintext'>
                            {formatDate(selectedCampaign.created_at)}
                          </p>
                        </div>
                        {selectedCampaign.admin_notes && (
                          <div className='mb-3'>
                            <label className='form-label fw-bold'>
                              Notes de l'équipe
                            </label>
                            <div className='alert alert-info'>
                              {selectedCampaign.admin_notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Produits */}
                    <div className='mt-4'>
                      <h6 className='fw-bold mb-3'>Produits de la campagne</h6>
                      <div className='row'>
                        {selectedCampaign.product_descriptions?.map(
                          (desc, index) => (
                            <div key={index} className='col-md-6 mb-3'>
                              <div className='card'>
                                <div className='card-body'>
                                  <h6 className='card-title'>
                                    Produit {index + 1}
                                  </h6>
                                  <p className='card-text'>{desc}</p>
                                  <p className='text-success fw-bold'>
                                    Prix:{' '}
                                    {formatCurrency(
                                      selectedCampaign.product_prices?.[
                                        index
                                      ] || 0
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    {selectedCampaign.product_images?.length > 0 && (
                      <div className='mt-4'>
                        <h6 className='fw-bold mb-3'>Images des produits</h6>
                        <div className='row'>
                          {selectedCampaign.product_images.map(
                            (image, index) => (
                              <div key={index} className='col-md-3 mb-3'>
                                <div
                                  className='bg-light rounded d-flex align-items-center justify-content-center'
                                  style={{ height: '120px', width: '100%' }}
                                >
                                  <div className='text-center'>
                                    <Eye
                                      size={24}
                                      className='text-muted mb-1'
                                    />
                                    <small className='text-muted d-block'>
                                      {image}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => setShowModal(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default VendorCampaignsPage
