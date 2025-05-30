import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Carousel } from 'react-bootstrap';
import { fetchPromotions } from '../services/promotionService';
import PromotionSection from '../components/acheteur/PromotionSection';
import { Link } from 'react-router-dom';
import './HomePage.css';
import StoreList from '../components/store/StoreList';

const HomePage = () => {
  const [promotions, setPromotions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const data = await fetchPromotions();
        setPromotions(data);
      } catch (err) {
        console.error('Erreur lors du chargement des promotions:', err);
        setError('Impossible de charger les promotions. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  // Bannière principale
  const Banner = () => (
    <div className="main-banner mb-4">
      <Carousel fade interval={5000}>
        <Carousel.Item>
          <div className="banner-item" style={{ backgroundImage: 'url(/banner1.jpg)' }}>
            <div className="banner-content">
              <h2>Bienvenue sur YToy Marketplace</h2>
              <p>Découvrez nos meilleures offres et promotions</p>
              <Link to="/products" className="btn btn-primary banner-btn">Voir les produits</Link>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="banner-item" style={{ backgroundImage: 'url(/banner2.jpg)' }}>
            <div className="banner-content">
              <h2>Super Deals de la Semaine</h2>
              <p>Jusqu'à 50% de réduction sur les articles sélectionnés</p>
              <Link to="/promotions/super_deal" className="btn btn-primary banner-btn">Voir les offres</Link>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );

  return (
    <Container fluid className="home-page py-4">
      <Banner />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement des promotions...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="promotions-container">
          <h1 className="text-center mb-5">Super Deals de la Semaine</h1>
          
          {/* Nouveau */}
          {promotions.nouveau && (
            <PromotionSection 
              title={promotions.nouveau.label} 
              items={promotions.nouveau.items}
              type="nouveau"
            />
          )}
          
          {/* Super Deal */}
          {promotions.super_deal && (
            <PromotionSection 
              title={promotions.super_deal.label} 
              items={promotions.super_deal.items}
              type="super_deal"
            />
          )}
          
          {/* Promotions */}
          {promotions.promotion && (
            <PromotionSection 
              title={promotions.promotion.label} 
              items={promotions.promotion.items}
              type="promotion"
            />
          )}
          
          {/* Top Deals */}
          {promotions.top_deal && (
            <PromotionSection 
              title={promotions.top_deal.label} 
              items={promotions.top_deal.items}
              type="top_deal"
            />
          )}

          {/* Boutiques */}
          <StoreList />

          {/* Le Njoh */}
          {promotions.le_njoh && (
            <PromotionSection 
              title={promotions.le_njoh.label} 
              items={promotions.le_njoh.items}
              type="le_njoh"
            />
          )}
          
          {/* Offre Special */}
          {promotions.offre_special && (
            <PromotionSection 
              title={promotions.offre_special.label} 
              items={promotions.offre_special.items}
              type="offre_special"
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default HomePage;
