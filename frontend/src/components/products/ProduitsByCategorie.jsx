import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ProduitsByCategorie = () => {
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { categorieId } = useParams(); // Récupère l'ID de catégorie depuis l'URL

  const fetchProduits = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Construire l'URL avec les paramètres de recherche et pagination
      let url = `http://localhost:8000/api/categories/${categorieId}/produits?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await axios.get(url);
      setCategorie(response.data.categorie);
      setProduits(response.data.produits.data);
      setCurrentPage(response.data.produits.current_page);
      setTotalPages(response.data.produits.last_page);
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err);
      setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Recherche produits
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProduits(1, searchTerm);
  };

  // Chargement initial
  useEffect(() => {
    fetchProduits(1);
  }, [categorieId]);

  // Pagination
  const handlePageChange = (page) => {
    fetchProduits(page, searchTerm);
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Produits dans la catégorie: {categorie.nom}</h2>
      
      {/* Formulaire de recherche */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Control 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button 
              type="submit" 
              style={{ backgroundColor: '#FF6600', borderColor: '#FF6600' }}
              className="w-100"
            >
              Rechercher
            </Button>
          </Col>
        </Row>
      </Form>
      
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
            <Alert variant="info">Aucun produit disponible dans cette catégorie.</Alert>
          ) : (
            <Row>
              {produits.map(produit => (
                <Col md={4} lg={3} key={produit.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {produit.thumbnail && (
                      <Card.Img 
                        variant="top" 
                        src={produit.thumbnail} 
                        style={{height: '200px', objectFit: 'cover'}}
                        alt={produit.nom}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{produit.nom}</Card.Title>
                      <Card.Text className="text-truncate">
                        {produit.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-primary">{produit.prix} FCFA</span>
                          <span className="badge bg-secondary">{produit.quantite_stock} en stock</span>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          className="w-100 mt-2"
                          as={Link}
                          to={`/produits/${produit.id}`}
                        >
                          Voir détails
                        </Button>
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
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Button 
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <li 
                    key={i + 1} 
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <Button 
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Button 
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ProduitsByCategorie;