import React from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './PromotionSection.css'

const PromotionSection = ({ title, items, type }) => {
  // Définir les styles en fonction du type de promotion
  const getBadgeStyle = () => {
    switch (type) {
      case 'nouveau':
        return { backgroundColor: '#FF9800', color: 'white' }
      case 'super_deal':
        return { backgroundColor: '#2196F3', color: 'white' }
      case 'promotion':
        return { backgroundColor: '#4CAF50', color: 'white' }
      case 'top_deal':
        return { backgroundColor: '#8BC34A', color: 'white' }
      case 'le_njoh':
        return { backgroundColor: '#9C27B0', color: 'white' }
      case 'offre_special':
        return { backgroundColor: '#F44336', color: 'white' }
      default:
        return { backgroundColor: '#FF6F00', color: 'white' }
    }
  }

  if (!items || items.length === 0) {
    return null
  }
  if (!items) return <div>Pas de données chargées</div>
  return (
    <Container fluid className='promotion-section my-4'>
      <div className='section-header d-flex justify-content-between align-items-center mb-3'>
        <h3 className='section-title'>{title}</h3>
        <Link to={`/promotions/${type}`} className='view-all'>
          Voir tout <i className='bi bi-arrow-right'></i>
        </Link>
      </div>
      <Row>
        {items.map(item => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
            <Card className='promotion-card h-100 shadow-sm'>
              <div className='badge-container'>
                <span className='promo-badge' style={getBadgeStyle()}>
                  {title}
                </span>
              </div>
              <Link to={`/produits/${item.produit_id}`}>
                <div className='card-img-container'>
                  <Card.Img
                    variant='top'
                    src={item.image_url || '/placeholder-image.jpg'}
                    alt={item.produit_nom}
                    className='card-img'
                  />
                </div>
              </Link>
              <Card.Body>
                <Link
                  to={`/produits/${item.produit_id}`}
                  className='text-decoration-none'
                >
                  <Card.Title className='product-title'>
                    {item.produit_nom || 'Produit'}
                  </Card.Title>

                  <small>Vendeur: {item.vendeur_nom || 'Inconnu'}</small>
                </Link>
                <div className='price-container mb-2'>
                  <span className='promo-price'>
                    {Number(item.prix_promo).toLocaleString()} FCFA
                  </span>
                  <span className='original-price'>
                    {Number(item.prix_normal).toLocaleString()} FCFA
                  </span>
                </div>
                <div className='discount-badge'>
                  -{Math.round(item.pourcentage_reduction)}%
                </div>
                <div className='vendor-name'>
                  <small>Vendeur: {item.vendeur_nom}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default PromotionSection
