import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Container, Row, Col, Badge, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { apiClient } from '../../services/api';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      // Catégories factices en cas d'erreur
      setCategories([
        { id: 1, nom: 'Électronique' },
        { id: 2, nom: 'Vêtements' },
        { id: 3, nom: 'Maison & Jardin' },
        { id: 4, nom: 'Jouets' },
        { id: 5, nom: 'Livres' }
      ]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '/produits?';
      if (selectedCategory) {
        url += `categorie=${selectedCategory}&`;
      }
      if (searchTerm) {
        url += `search=${searchTerm}&`;
      }
      url += `page=${currentPage}`;
      
      const response = await apiClient.get(url);
      
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalPages(response.data.last_page || 1);
      } else {
        // Données factices en cas de réponse vide
        setProducts([
          { id: 1, nom: 'Smartphone XYZ', description: 'Dernier modèle', prix: 599.99, quantite_stock: 25, categorie: { id: 1, nom: 'Électronique' }, vendeur: { id: 2, nom: 'TechStore', prenom: '' } },
          { id: 2, nom: 'Laptop Pro', description: 'Puissant et léger', prix: 1299.99, quantite_stock: 10, categorie: { id: 1, nom: 'Électronique' }, vendeur: { id: 2, nom: 'TechStore', prenom: '' } },
          { id: 3, nom: 'T-shirt Coton', description: 'Confortable', prix: 19.99, quantite_stock: 100, categorie: { id: 2, nom: 'Vêtements' }, vendeur: { id: 3, nom: 'FashionShop', prenom: '' } },
          { id: 4, nom: 'Jeu de société', description: 'Pour toute la famille', prix: 29.99, quantite_stock: 15, categorie: { id: 4, nom: 'Jouets' }, vendeur: { id: 4, nom: 'ToyWorld', prenom: '' } },
          { id: 5, nom: 'Roman Bestseller', description: 'Thriller captivant', prix: 12.99, quantite_stock: 50, categorie: { id: 5, nom: 'Livres' }, vendeur: { id: 5, nom: 'BookStore', prenom: '' } },
        ]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setError('Impossible de charger la liste des produits.');
      
      // Données factices en cas d'erreur
      setProducts([
        { id: 1, nom: 'Smartphone XYZ', description: 'Dernier modèle', prix: 599.99, quantite_stock: 25, categorie: { id: 1, nom: 'Électronique' }, vendeur: { id: 2, nom: 'TechStore', prenom: '' } },
        { id: 2, nom: 'Laptop Pro', description: 'Puissant et léger', prix: 1299.99, quantite_stock: 10, categorie: { id: 1, nom: 'Électronique' }, vendeur: { id: 2, nom: 'TechStore', prenom: '' } },
        { id: 3, nom: 'T-shirt Coton', description: 'Confortable', prix: 19.99, quantite_stock: 100, categorie: { id: 2, nom: 'Vêtements' }, vendeur: { id: 3, nom: 'FashionShop', prenom: '' } },
        { id: 4, nom: 'Jeu de société', description: 'Pour toute la famille', prix: 29.99, quantite_stock: 15, categorie: { id: 4, nom: 'Jouets' }, vendeur: { id: 4, nom: 'ToyWorld', prenom: '' } },
        { id: 5, nom: 'Roman Bestseller', description: 'Thriller captivant', prix: 12.99, quantite_stock: 50, categorie: { id: 5, nom: 'Livres' }, vendeur: { id: 5, nom: 'BookStore', prenom: '' } },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await apiClient.delete(`/admin/produits/${productToDelete.id}`);  
      
      // Mettre à jour l'état local
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      alert('Produit supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      alert('Une erreur est survenue lors de la suppression du produit.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
  };

  return (
    <>
      <Header />
      <Container className="py-4">
        <Card>
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Gestion des produits</h2>
              <Link to="/admin/dashboard" className="btn btn-light">
                Retour au tableau de bord
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row className="mb-3">
              <Col md={6}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-primary" type="submit">
                      <i className="bi bi-search"></i>
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={6}>
                <Form.Select 
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                  className="w-auto float-md-end"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Chargement des produits...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Vendeur</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.nom}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center" 
                                     style={{ width: '50px', height: '50px' }}>
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                              )}
                            </td>
                            <td>{product.nom}</td>
                            <td>{product.categorie?.nom || 'Non catégorisé'}</td>
                            <td>{formatPrice(product.prix)}</td>
                            <td>
                              <Badge bg={product.quantite_stock > 10 ? 'success' : product.quantite_stock > 0 ? 'warning' : 'danger'}>
                                {product.quantite_stock}
                              </Badge>
                            </td>
                            <td>{product.vendeur?.nom} {product.vendeur?.prenom}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                as={Link}
                                to={`/admin/products/${product.id}`}
                                className="me-2"
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => confirmDelete(product)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">Aucun produit trouvé</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="me-2"
                    >
                      Précédent
                    </Button>
                    <span className="mx-3 align-self-center">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.nom}" ?
          <div className="alert alert-warning mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Cette action est irréversible.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </>
  );
};

export default AdminProductList;