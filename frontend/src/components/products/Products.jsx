import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';

const Products = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const fetchProduits = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      // Construire l'URL avec les paramètres de recherche et pagination
      let url = `http://localhost:8000/api/produits?page=${page}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await axios.get(url);
      setProduits(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err);
      setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial et lors du changement de recherche
  useEffect(() => {
    fetchProduits(1);
  }, [searchTerm]);

  // Pagination
  const handlePageChange = (page) => {
    fetchProduits(page);
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">
        {searchTerm 
          ? `Résultats de recherche pour : ${searchTerm}`
          : 'Tous les produits'
        }
      </h2>
      
      {/* Message d'erreur */}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Indicateur de chargement */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Liste des produits */}
          {produits.length === 0 ? (
            <Alert variant="info">
              {searchTerm 
                ? `Aucun produit trouvé pour : ${searchTerm}`
                : 'Aucun produit disponible.'
              }
            </Alert>
          ) : (
            <Row>
              {produits.map(produit => (
                <Col key={produit.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {produit.images && produit.images[0] && (
                      <Card.Img
                        variant="top"
                        src={produit.images[0].url}
                        alt={produit.nom}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{produit.nom}</Card.Title>
                      <Card.Text className="text-muted mb-2">
                        {produit.description.substring(0, 100)}...
                      </Card.Text>
                      <Card.Text className="text-primary fw-bold mb-3">
                        {produit.prix} FCFA
                      </Card.Text>
                      <div className="mt-auto">
                        <Link 
                          to={`/product/${produit.id}`}
                          className="btn w-100"
                          style={{ backgroundColor: '#FF6600', borderColor: '#FF6600', color: 'white' }}
                        >
                          Voir détails
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <li 
                      key={index + 1} 
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <Button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                        style={
                          currentPage === index + 1 
                            ? { backgroundColor: '#FF6600', borderColor: '#FF6600' }
                            : {}
                        }
                      >
                        {index + 1}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
