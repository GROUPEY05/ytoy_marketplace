import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import StarRating from '../common/StarRating';

// Composant pour afficher les étoiles de notation
const StarRatingDisplay = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i 
        key={i} 
        className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'}`} 
        style={{ color: i <= rating ? '#FFD700' : '#ccc', marginRight: '2px' }}
      ></i>
    );
  }
  return <div>{stars}</div>;
};

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0
  });

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/vendor/reviews?page=${page}&per_page=${perPage}&filter=${filter}`);
      
      if (response.data) {
        setReviews(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        
        // Mettre à jour les statistiques
        if (response.data.stats) {
          setStats({
            averageRating: response.data.stats.average_rating || 0,
            totalReviews: response.data.stats.total_reviews || 0,
            fiveStars: response.data.stats.five_stars || 0,
            fourStars: response.data.stats.four_stars || 0,
            threeStars: response.data.stats.three_stars || 0,
            twoStars: response.data.stats.two_stars || 0,
            oneStar: response.data.stats.one_star || 0
          });
        }
      }
      
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des avis', err);
      setError('Impossible de charger vos avis. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [filter]);
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const handleReplyChange = (reviewId, text) => {
    setReplyText({
      ...replyText,
      [reviewId]: text
    });
  };
  
  const submitReply = async (reviewId) => {
    if (!replyText[reviewId] || replyText[reviewId].trim() === '') return;
    
    try {
      setSubmitting(true);
      await apiClient.post(`/api/vendor/reviews/${reviewId}/reply`, { 
        reply: replyText[reviewId] 
      });
      
      // Mettre à jour l'état local
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, vendor_reply: replyText[reviewId], has_reply: true } 
          : review
      ));
      
      // Réinitialiser le texte de réponse
      setReplyText({
        ...replyText,
        [reviewId]: ''
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse', error);
      setError('Erreur lors de l\'envoi de votre réponse');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const getStarPercentage = (count) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Avis Clients</h2>
      </div>
      
      {/* Statistiques des avis */}
      <Row className="mb-4">
        <Col lg={4} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body className="text-center">
              <h4 className="mb-3">Note Moyenne</h4>
              <div className="display-4 mb-2" style={{ color: '#FF6F00' }}>
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRatingDisplay rating={Math.round(stats.averageRating)} />
              <p className="mt-2 text-muted">{stats.totalReviews} avis au total</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow h-100">
            <Card.Body>
              <h4 className="mb-3">Répartition des Notes</h4>
              
              <div className="rating-bars">
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">5 ★</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${getStarPercentage(stats.fiveStars)}%`, backgroundColor: '#FF6F00' }}
                      aria-valuenow={getStarPercentage(stats.fiveStars)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="ms-2 text-muted">{stats.fiveStars}</div>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">4 ★</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${getStarPercentage(stats.fourStars)}%`, backgroundColor: '#FF6F00' }}
                      aria-valuenow={getStarPercentage(stats.fourStars)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="ms-2 text-muted">{stats.fourStars}</div>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">3 ★</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${getStarPercentage(stats.threeStars)}%`, backgroundColor: '#FF6F00' }}
                      aria-valuenow={getStarPercentage(stats.threeStars)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="ms-2 text-muted">{stats.threeStars}</div>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2">2 ★</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${getStarPercentage(stats.twoStars)}%`, backgroundColor: '#FF6F00' }}
                      aria-valuenow={getStarPercentage(stats.twoStars)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="ms-2 text-muted">{stats.twoStars}</div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="me-2">1 ★</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${getStarPercentage(stats.oneStar)}%`, backgroundColor: '#FF6F00' }}
                      aria-valuenow={getStarPercentage(stats.oneStar)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="ms-2 text-muted">{stats.oneStar}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Liste des Avis</h6>
          <div className="btn-group">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => handleFilterChange('all')}
              style={filter === 'all' ? { backgroundColor: '#FF6F00', borderColor: '#FF6F00' } : {}}
            >
              Tous
            </Button>
            <Button 
              variant={filter === 'positive' ? 'primary' : 'outline-primary'} 
              onClick={() => handleFilterChange('positive')}
              style={filter === 'positive' ? { backgroundColor: '#FF6F00', borderColor: '#FF6F00' } : {}}
            >
              Positifs (4-5★)
            </Button>
            <Button 
              variant={filter === 'neutral' ? 'primary' : 'outline-primary'} 
              onClick={() => handleFilterChange('neutral')}
              style={filter === 'neutral' ? { backgroundColor: '#FF6F00', borderColor: '#FF6F00' } : {}}
            >
              Neutres (3★)
            </Button>
            <Button 
              variant={filter === 'negative' ? 'primary' : 'outline-primary'} 
              onClick={() => handleFilterChange('negative')}
              style={filter === 'negative' ? { backgroundColor: '#FF6F00', borderColor: '#FF6F00' } : {}}
            >
              Négatifs (1-2★)
            </Button>
            <Button 
              variant={filter === 'unanswered' ? 'primary' : 'outline-primary'} 
              onClick={() => handleFilterChange('unanswered')}
              style={filter === 'unanswered' ? { backgroundColor: '#FF6F00', borderColor: '#FF6F00' } : {}}
            >
              Sans réponse
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading && reviews.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Chargement des avis...</p>
            </div>
          ) : (
            <>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="mb-3 border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <div className="d-flex align-items-center">
                            <StarRatingDisplay rating={review.rating} />
                            <span className="ms-2 text-muted">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          <h5 className="mt-2 mb-0">
                            <Link to={`/vendeur/products/${review.produit_id}`} className="text-decoration-none">
                              {review.produit_nom}
                            </Link>
                          </h5>
                        </div>
                        <div>
                          <Badge bg={review.has_reply ? 'success' : 'warning'}>
                            {review.has_reply ? 'Répondu' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <div 
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                            style={{ width: '30px', height: '30px', backgroundColor: '#FF6F00' }}
                          >
                            <i className="bi bi-person-fill text-white"></i>
                          </div>
                          <strong>{review.client_nom}</strong>
                        </div>
                        <p className="mb-0">{review.commentaire}</p>
                      </div>
                      
                      {review.has_reply && (
                        <div className="ms-4 mt-3 p-3 bg-light rounded">
                          <div className="d-flex align-items-center mb-2">
                            <div 
                              className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2"
                              style={{ width: '30px', height: '30px' }}
                            >
                              <i className="bi bi-shop text-white"></i>
                            </div>
                            <strong>Votre réponse</strong>
                          </div>
                          <p className="mb-0">{review.vendor_reply}</p>
                        </div>
                      )}
                      
                      {!review.has_reply && (
                        <div className="mt-3">
                          <Form.Group>
                            <Form.Label>Répondre à cet avis</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={replyText[review.id] || ''}
                              onChange={(e) => handleReplyChange(review.id, e.target.value)}
                              placeholder="Écrivez votre réponse ici..."
                            />
                          </Form.Group>
                          <Button 
                            variant="primary" 
                            className="mt-2" 
                            onClick={() => submitReply(review.id)}
                            disabled={submitting || !replyText[review.id] || replyText[review.id].trim() === ''}
                            style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
                          >
                            {submitting ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-1"
                                />
                                Envoi...
                              </>
                            ) : (
                              'Envoyer la réponse'
                            )}
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-chat-square-text fs-1 text-muted"></i>
                  <p className="mt-2">
                    {filter !== 'all' 
                      ? `Aucun avis ne correspond au filtre "${filter}"`
                      : 'Aucun avis client pour le moment'}
                  </p>
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => fetchReviews(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => fetchReviews(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next
                      onClick={() => fetchReviews(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VendorReviews;
