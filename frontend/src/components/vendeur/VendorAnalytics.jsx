import React, { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  ProgressBar
} from 'react-bootstrap'
import { apiClient } from '../../services/api'
import CategoryPieChart from '../CategoryPieChart'
import VendeurSidebar from './VendeurSidebar'

const VendorAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('month')
  const [salesData, setSalesData] = useState({
    labels: [],
    revenue: [],
    orders: []
  })
  const [productPerformance, setProductPerformance] = useState({
    labels: [],
    sales: []
  })
  const [categoryDistribution, setCategoryDistribution] = useState({
    labels: [],
    values: []
  })
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0
  })

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(
        `/api/vendor/analytics?period=${period}`
      )

      if (response.data) {
        // Mettre à jour les statistiques générales
        setStats({
          totalRevenue: response.data.total_revenue || 0,
          totalOrders: response.data.total_orders || 0,
          averageOrderValue: response.data.average_order_value || 0,
          conversionRate: response.data.conversion_rate || 0
        })

        // Configurer les données pour le graphique des ventes
        setSalesData({
          labels: response.data.sales_chart.labels || [],
          revenue: response.data.sales_chart.revenue || [],
          orders: response.data.sales_chart.orders || []
        })

        // Configurer les données pour le graphique de performance des produits
        setProductPerformance({
          labels: response.data.product_performance.labels || [],
          sales: response.data.product_performance.sales || []
        })

        // Configurer les données pour le graphique de distribution par catégorie
        setCategoryDistribution({
          labels: response.data.category_distribution.labels || [],
          values: response.data.category_distribution.values || []
        })
      }

      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques', err)
      setError(
        'Impossible de charger les statistiques. Veuillez réessayer plus tard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const handlePeriodChange = e => {
    setPeriod(e.target.value)
  }

  // Fonction pour obtenir la valeur maximale d'un tableau
  const getMaxValue = arr => Math.max(...arr.map(Number))
  const calculatePercentage = (value, max) =>
    max > 0 ? (Number(value) / max) * 100 : 0

  return (
    <div className=' container-fluid py-4'>
      <div className='row'>
        {/* Sidebar */}
        <VendeurSidebar />
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2 className='mb-0'>Statistiques et Analyses</h2>
            <Form.Group className='mb-0'>
              <Form.Select
                value={period}
                onChange={handlePeriodChange}
                style={{ borderColor: '#FF6F00' }}
              >
                <option value='week'>7 derniers jours</option>
                <option value='month'>30 derniers jours</option>
                <option value='quarter'>3 derniers mois</option>
                <option value='year'>12 derniers mois</option>
              </Form.Select>
            </Form.Group>
          </div>

          {error && <Alert variant='danger'>{error}</Alert>}

          {loading ? (
            <div className='text-center py-5'>
              <Spinner
                animation='border'
                variant='primary'
                style={{ color: '#FF6F00' }}
              />
              <p className='mt-3'>Chargement des statistiques...</p>
            </div>
          ) : (
            <>
              {/* Cartes de statistiques */}
              <Row className='mb-4'>
                <Col xl={3} md={6} className='mb-4'>
                  <Card className='border-left-primary shadow h-100 py-2'>
                    <Card.Body>
                      <Row className='no-gutters align-items-center'>
                        <Col className='mr-2'>
                          <div className='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                            Chiffre d'affaires
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {parseFloat(stats.totalRevenue || 0).toFixed(2)}{' '}
                            Francs
                          </div>
                        </Col>
                        <Col xs='auto'>
                          <span className='fs-5 fw-semibold text-gray-500'>
                            F&nbsp;CFA
                          </span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} md={6} className='mb-4'>
                  <Card className='border-left-success shadow h-100 py-2'>
                    <Card.Body>
                      <Row className='no-gutters align-items-center'>
                        <Col className='mr-2'>
                          <div className='text-xs font-weight-bold text-success text-uppercase mb-1'>
                            Commandes
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats.totalOrders}
                          </div>
                        </Col>
                        <Col xs='auto'>
                          <i className='bi bi-bag-check fs-2 text-gray-300'></i>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} md={6} className='mb-4'>
                  <Card className='border-left-info shadow h-100 py-2'>
                    <Card.Body>
                      <Row className='no-gutters align-items-center'>
                        <Col className='mr-2'>
                          <div className='text-xs font-weight-bold text-info text-uppercase mb-1'>
                            Panier Moyen
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats.averageOrderValue.toFixed(2)} Francs
                          </div>
                        </Col>
                        <Col xs='auto'>
                          <i className='bi bi-cart fs-2 text-gray-300'></i>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} md={6} className='mb-4'>
                  <Card className='border-left-warning shadow h-100 py-2'>
                    <Card.Body>
                      <Row className='no-gutters align-items-center'>
                        <Col className='mr-2'>
                          <div className='text-xs font-weight-bold text-warning text-uppercase mb-1'>
                            Taux de Conversion
                          </div>
                          <div className='h5 mb-0 font-weight-bold text-gray-800'>
                            {stats.conversionRate.toFixed(2)}%
                          </div>
                        </Col>
                        <Col xs='auto'>
                          <i className='bi bi-graph-up-arrow fs-2 text-gray-300'></i>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Graphiques */}
              <Row className='mb-4'>
                <Col xl={7} lg={1} className='mb-4'>
                  <CategoryPieChart
                    categoryDistribution={categoryDistribution}
                  />
                </Col>

                <Col xl={4} lg={5}>
                  <Card className='shadow h-100'>
                    <Card.Body>
                      <h4 className='mb-3'>Répartition par catégorie</h4>
                      {categoryDistribution.labels.length > 0 ? (
                        <div className='category-distribution'>
                          {categoryDistribution.labels.map((label, index) => {
                            const total = categoryDistribution.values.reduce(
                              (acc, val) => acc + val,
                              0
                            )
                            const percentage =
                              total > 0
                                ? (categoryDistribution.values[index] / total) *
                                  100
                                : 0

                            const colors = [
                              '#FF6F00',
                              '#2196F3',
                              '#4CAF50',
                              '#FFC107',
                              '#9C27B0',
                              '#F44336',
                              '#3F51B5',
                              '#E91E63',
                              '#00BCD4',
                              '#CDDC39'
                            ]
                            const color = colors[index % colors.length]

                            return (
                              <div key={index} className='mb-3'>
                                <div className='d-flex justify-content-between align-items-center mb-1'>
                                  <div>{label}</div>
                                  <div>
                                    <strong>{percentage.toFixed(1)}%</strong> (
                                    {categoryDistribution.values[index]})
                                  </div>
                                </div>
                                <ProgressBar
                                  now={percentage}
                                  variant='warning'
                                  style={{
                                    backgroundColor: '#e9ecef',
                                    height: '20px'
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className='text-center py-5'>
                          <p>Aucune donnée disponible</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card className='shadow'>
                    <Card.Body>
                      <h4 className='mb-3'>Produits les plus vendus</h4>
                      {productPerformance.labels.length > 0 ? (
                        <div className='product-performance'>
                          {productPerformance.labels.map((label, index) => {
                            const maxSales = getMaxValue(
                              productPerformance.sales
                            )
                            const percentage = calculatePercentage(
                              productPerformance.sales[index],
                              maxSales
                            )

                            return (
                              <div key={index} className='mb-3'>
                                <div className='d-flex justify-content-between align-items-center mb-1'>
                                  <div
                                    className='text-truncate'
                                    style={{ maxWidth: '70%' }}
                                  >
                                    {label}
                                  </div>
                                  <div>
                                    <strong>
                                      {productPerformance.sales[index]}
                                    </strong>{' '}
                                    ventes
                                  </div>
                                </div>
                                <ProgressBar
                                  now={percentage}
                                  style={{
                                    backgroundColor: '#e9ecef',
                                    height: '20px',
                                    backgroundColor: '#FF6F00'
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className='text-center py-5'>
                          <p>Aucune donnée disponible</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Boutons d'export */}
              <div className='d-flex justify-content-end mt-4'>
                <Button
                  variant='outline-primary'
                  className='me-2'
                  style={{ borderColor: '#FF6F00', color: '#FF6F00' }}
                >
                  <i className='bi bi-file-earmark-excel me-1'></i> Exporter en
                  Excel
                </Button>
                <Button
                  variant='outline-primary'
                  style={{ borderColor: '#FF6F00', color: '#FF6F00' }}
                >
                  <i className='bi bi-file-earmark-pdf me-1'></i> Exporter en
                  PDF
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default VendorAnalytics
