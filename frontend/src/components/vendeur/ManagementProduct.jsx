import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Badge, Pagination, Form, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VendeurSidebar from './VendeurSidebar'

const ProductManagement = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProduits = async (page = 1, search = searchTerm) => {
    try {
      setLoading(true);
      const response = await axios.get('/vendor/products', {
        params: {
          page,
          search,
          per_page: pagination.perPage,
        },
      });
      
      setProduits(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handlePageChange = (page) => {
    fetchProduits(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProduits(1, searchTerm);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (produitId) => {
    setConfirmDelete(produitId);
  };

  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`/products/${confirmDelete}`);
      setProduits(produits.filter(produit => produit.id !== confirmDelete));
      setConfirmDelete(null);
      
      // Recalculer la pagination si nécessaire
      if (produits.length === 1 && pagination.currentPage > 1) {
        fetchProduits(pagination.currentPage - 1);
      } else {
        fetchProduits(pagination.currentPage);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err);
      setError('Impossible de supprimer le produit. Veuillez réessayer plus tard.');
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Générer les éléments de pagination
  const paginationItems = [];
  for (let page = 1; page <= pagination.lastPage; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === pagination.currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
       {/* Sidebar */}
        <VendeurSidebar onLogout={handleLogout} />
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h2>Gestion des produits</h2>
          <Link to="/dashboard/products/new">
            <Button style={{ backgroundColor: '#FF6600', borderColor: '#FF6600' }}>
              Ajouter un produit
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Confirmation de suppression */}
          {confirmDelete && (
            <Alert variant="warning" className="mb-4">
              <p>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
              <div className="d-flex gap-2">
                <Button variant="danger" onClick={confirmDeleteProduct}>
                  Oui, supprimer
                </Button>
                <Button variant="secondary" onClick={cancelDelete}>
                  Annuler
                </Button>
              </div>
            </Alert>
          )}

          {/* Recherche */}
          <Row className="mb-4">
            <Col md={6}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                  <Button 
                    variant="outline-secondary" 
                    type="submit"
                  >
                    Rechercher
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={6} className="text-md-end text-start mt-3 mt-md-0">
              <span className="text-muted">
                {pagination.total} produit{pagination.total > 1 ? 's' : ''} au total
              </span>
            </Col>
          </Row>

          {/* Tableau des produits */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : produits.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">Aucun produit trouvé</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Catégorie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((produit) => (
                    <tr key={produit.id}>
                      <td>
                        {produit.thumbnail ? (
                          <img
                            src={produit.thumbnail}
                            alt={produit.nom}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="border"
                          />
                        ) : (
                          <div 
                            className="bg-light d-flex align-items-center justify-content-center border" 
                            style={{ width: '60px', height: '60px' }}
                          >
                            Aucune
                          </div>
                        )}
                      </td>
                      <td>{produit.nom}</td>
                      <td>{Number(produit.prix).toFixed(2)} €</td>
                      <td>
                        <Badge bg={produit.quantite_stock > 10 ? 'success' : produit.quantite_stock > 0 ? 'warning' : 'danger'}>
                          {produit.quantite_stock}
                        </Badge>
                      </td>
                      <td>{produit.categorie?.nom || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/dashboard/products/edit/${produit.id}`}>
                            <Button 
                              variant="outline-primary"
                              size="sm"
                            >
                              Modifier
                            </Button>
                          </Link>
                          <Button 
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev 
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                />
                
                {paginationItems}
                
                <Pagination.Next 
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => handlePageChange(pagination.lastPage)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductManagement;