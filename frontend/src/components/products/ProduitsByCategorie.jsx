import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProduitsByCategorie = () => {
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { categorieId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isVendeur = user?.role === 'vendeur';
  const isAdmin = user?.role === 'administrateur';
  const isAcheteur = user?.role === 'acheteur';

  const fetchProduits = async (page = 1, search = '') => {
    setLoading(true)
    try {
      let url = `http://localhost:8000/api/categories/${categorieId}/produits?page=${page}`
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }
      const response = await axios.get(url)
      console.log('Réponse API produits:', response.data)
      
      // Vérifier la structure des données de chaque produit
      response.data.produits.data.forEach(produit => {
        console.log('Produit:', produit.nom)
        console.log('Images du produit:', produit.images)
      })
      
      setCategorie(response.data.categorie);
      setProduits(response.data.produits.data);
      setCurrentPage(response.data.produits.current_page);
      setTotalPages(response.data.produits.last_page);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
      setError('Erreur lors de la récupération des produits')
    }
    setLoading(false)
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProduits(1, searchTerm);
  };

  const handlePageChange = (page) => {
    fetchProduits(page, searchTerm);
  };

  useEffect(() => {
    fetchProduits(1);
  }, [categorieId]);

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/vendor/produits/${selectedProduct.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Rafraîchir la liste des produits
      fetchProduits(currentPage, searchTerm);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du produit');
    }
  };

  const handleAddToCart = async (produit) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/cart/add', {
        produit_id: produit.id,
        quantite: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Mettre à jour le nombre d'articles dans le panier
      const cartCountEvent = new CustomEvent('cartUpdated', {
        detail: { count: response.data.cartCount }
      });
      window.dispatchEvent(cartCountEvent);

      // Afficher un message de succès
      setMessage({
        text: 'Produit ajouté au panier avec succès!',
        type: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setError('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <Container className="my-4">
      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
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
      <h2 className="mb-4">Produits dans la catégorie: {categorie.nom}</h2>

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

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {produits.length === 0 ? (
            <Alert variant="info">Aucun produit disponible dans cette catégorie.</Alert>
          ) : (
            <Row>
              {produits.map((produit) => {
                const canEdit = isAdmin || (isVendeur && produit.vendeur_id === user?.id);
                // Construction de l'URL de l'image avec gestion des erreurs
                const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
                let imageUrl;
                if (produit.images && produit.images.length > 0) {
                  const imageData = produit.images[0];
                  console.log('Données image pour', produit.nom + ':', imageData);
                  
                  // Si l'URL commence déjà par http://, on la garde telle quelle
                  if (imageData.url.startsWith('http://') || imageData.url.startsWith('https://')) {
                    imageUrl = imageData.url;
                  } else {
                    // Sinon, on construit l'URL complète
                    imageUrl = `http://localhost:8000/storage/${imageData.url}`;
                  }
                  console.log('URL finale de l\'image pour', produit.nom + ':', imageUrl);
                } else {
                  console.log('Aucune image trouvée pour', produit.nom);
                  imageUrl = defaultImage;
                }

                return (
                  <Col key={produit.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <div className="position-relative" style={{ height: '200px' }}>
                        <Card.Img
                          variant="top"
                          src={imageUrl}
                          alt={produit.nom}
                          style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'contain',
                            padding: '10px',
                            backgroundColor: '#f8f9fa'
                          }}
                          onError={(e) => {
                            console.log('Image load error for', produit.nom + ':', imageUrl);
                            e.target.src = defaultImage;
                            e.target.onerror = null; // Évite les boucles infinies
                          }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{produit.nom}</Card.Title>
                        <Card.Text className="text-muted mb-2">
                          {produit.description.substring(0, 100)}...
                        </Card.Text>
                        <Card.Text className="text-primary fw-bold mb-3">
                          {produit.prix} FCFA
                        </Card.Text>
                        <div className="mt-auto d-flex flex-column gap-2">
                          <Link
                            to={`/produits/${produit.id}`}
                            className="btn w-100"
                            style={{ backgroundColor: '#FF6600', borderColor: '#FF6600', color: 'white' }}
                          >
                            Voir détails
                          </Link>

                          {canEdit && (
                            <div className="d-flex gap-2">
                              <Link
                                to={`/vendeur/addproduct/edit/${produit.id}`}
                                className="btn btn-warning flex-grow-1"
                              >
                                Modifier
                              </Link>
                              <Button
                                variant="danger"
                                className="flex-grow-1"
                                onClick={() => {
                                  setSelectedProduct(produit);
                                  setShowDeleteModal(true);
                                }}
                              >
                                Supprimer
                              </Button>
                            </div>
                          )}

                          {isAcheteur && (
                            <Button
                              onClick={() => handleAddToCart(produit)}
                              className="btn w-100"
                              style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: 'white' }}
                            >
                              Ajouter au panier
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}

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