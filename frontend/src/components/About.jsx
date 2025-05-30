import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUsers, FaTruck, FaHandshake } from 'react-icons/fa';
import './About.css';
import Header from './layout/Header'
import Footer from './layout/Footer'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Ornella Yimga',
      role: 'Fondatrice & CEO',
      image: 'http://localhost:5173/image/ornella.jpg',
      bio: 'Passionnée par le commerce électronique  et le développement web depuis 3 ans, Ornella a créé cette marketplace pour connecter vendeurs et acheteurs dans tout le cameroun et avec le temps dans toute l\'Afrique.'
    },
    {
      name: 'Ndouho Wilfried',
      role: 'Directeur Technique',
      image: 'http://localhost:5173/image/wilfried.jpg',
      bio: 'Expert en développement web avec une vision claire pour offrir une expérience utilisateur fluide et sécurisée.'
    },
    {
      name: 'Kouatchou Maurice',
      role: 'Responsable Marketing',
      image: 'http://localhost:5173/image/papa.jpg',
      bio: 'Spécialiste en stratégies digitales, Fatou assure la croissance et la visibilité de notre marketplace.'
    }
  ];

  const milestones = [
    { year: 2025, event: 'Lancement de la plateforme' },
    { year: 2026, event: 'Plus de 500 vendeurs actifs' },
    { year: 2028, event: 'Expansion dans 5 pays d\'Afrique' },
    { year: 2029, event: 'Prix de la meilleure marketplace africaine' },
    { year: 2030, event: 'Lancement de l\'application mobile' }
  ];

  return (
    <><Header /><div className="about-page">
      {/* Hero Section */}
      <header className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-4 fw-bold">Notre Histoire</h1>
              <p className="lead">Découvrez comment nous comptons révolutionner le commerce en ligne en Afrique</p>
              <Button variant="primary" className="btn-orange">Rejoignez-nous</Button>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <img
                src="http://localhost:5173/image/pexels-timmossholder-942320.jpg"
                alt="Marketplace Illustration"
                className="img-fluid rounded-3 shadow" />
            </Col>
          </Row>
        </Container>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Notre Mission</h2>
            <div className="title-underline"></div>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper">
                    <FaShoppingCart className="feature-icon" />
                  </div>
                  <Card.Title>Simplifier l'achat</Card.Title>
                  <Card.Text>
                    Nous rendons le shopping en ligne simple, sécurisé et accessible à tous.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper">
                    <FaUsers className="feature-icon" />
                  </div>
                  <Card.Title>Créer une communauté</Card.Title>
                  <Card.Text>
                    Nous connectons acheteurs et vendeurs pour créer un écosystème dynamique.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper">
                    <FaTruck className="feature-icon" />
                  </div>
                  <Card.Title>Faciliter la logistique</Card.Title>
                  <Card.Text>
                    Nous optimisons les livraisons pour garantir satisfaction et rapidité.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper">
                    <FaHandshake className="feature-icon" />
                  </div>
                  <Card.Title>Promouvoir l'équité</Card.Title>
                  <Card.Text>
                    Nous soutenons un commerce juste et équitable pour tous les acteurs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img
              
                src="http://localhost:5173/image/pexels-kelly-1179532-17290985.jpg"
                alt="Notre histoire"
                className="img-fluid rounded-3 shadow" />
            </Col>
            <Col lg={6}>
              <h2 className="section-title">D'où nous venons</h2>
              <div className="title-underline mb-4"></div>
              <p className="story-text">
                Notre marketplace est née d'une vision audacieuse : créer une plateforme où les talents commerciaux africains pourraient s'épanouir à l'échelle internationale.
              </p>
              <p className="story-text">
                Nous avons commencé modestement en 2025, avec seulement quelques vendeurs passionnés. Aujourd'hui, nous continuons  d'entreprendre avec eu  à travers le continent.
              </p>
              <p className="story-text">
                Notre engagement envers l'innovation, la qualité et le service client nous  permettra de devenir une référence dans le secteur du e-commerce africain.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Notre Équipe</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Les visionnaires derrière notre  futures succès</p>
          </div>
          <Row className="g-4">
            {teamMembers.map((member, index) => (
              <Col md={4} key={index}>
                <Card className="team-card h-100">
                  <div className="text-center pt-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-image rounded-circle" />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="team-name">{member.name}</Card.Title>
                    <Card.Subtitle className="team-role mb-3">{member.role}</Card.Subtitle>
                    <Card.Text>{member.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Milestones Section */}
      <section className="milestones-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Notre Parcours Souhaiter</h2>
            <div className="title-underline"></div>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-badge">{milestone.year}</div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">{milestone.event}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container className="text-center">
          <h2 className="cta-title">Rejoignez notre communauté</h2>
          <p className="cta-text">
            Que vous soyez un acheteur à la recherche de produits uniques ou un vendeur souhaitant développer votre activité,
            notre marketplace est l'endroit idéal pour vous.
          </p>
          <div className="cta-buttons">
            <Button variant="primary" className="btn-orange me-3"><strong>Devenir Vendeur </strong></Button>
            <Button variant="outline-light">Explorer les Produits</Button>
          </div>
        </Container>
      </section>
    </div><br /><br />
    <Footer /></>
  );
};

export default AboutPage;