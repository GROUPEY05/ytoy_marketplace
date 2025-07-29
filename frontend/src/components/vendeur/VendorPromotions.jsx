import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Modal, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VendorPromotions = () => {
  const { currentUser } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // État pour le formulaire de création/modification
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    produit_id: '',
    prix_promo: '',
    date_debut: '',
    date_fin: '',
    type_promo: 'promotion',
    actif: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromotionId, setCurrentPromotionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Types de promotions
  const promoTypes = [
    { value: 'promotion', label: 'Promotion' },
    { value: 'super_deal', label: 'Super Deal' },
    { value: 'nouveau', label: 'Nouveau' },
    { value: 'top_deal', label: 'Top Deal' },
    { value: 'le_njoh', label: 'Le Njoh' },
    { value: 'offre_special', label: 'Offre Spéciale' }
  ];
  
  // Charger les promotions
  const fetchPromotions = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      
      if (filterType) {
        params.append('type', filterType);
      }
      
      if (filterStatus !== '') {
        params.append('actif', filterStatus === 'actif' ? 'true' : 'false');
      }
      
      const response = await apiClient.get(`/vendor/promotions?${params.toString()}`);
      
      if (response.data) {
        setPromotions(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des promotions:', err);
      setError('Impossible de charger vos promotions. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les produits du vendeur
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await apiClient.get('/vendor/produits');
      
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoadingProducts(false);
    }
  };
  
  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [filterType, filterStatus]);
  
  // Gérer le changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPromotions(page);
  };
  
  // Gérer le changement de filtre
  const handleFilterChange = (e, type) => {
    if (type === 'type') {
      setFilterType(e.target.value);
    } else if (type === 'status') {
      setFilterStatus(e.target.value);
    }
    setCurrentPage(1);
  };
  
  // Ouvrir le modal pour créer une promotion
  const openCreateModal = () => {
    setFormData({
      titre: '',
      description: '',
      produit_id: '',
      prix_promo: '',
      date_debut: '',
      date_fin: '',
      type_promo: 'promotion',
      actif: true
    });
    setIsEditing(false);
    setCurrentPromotionId(null);
    setFormError('');
    setShowModal(true);
  };
  
  // Ouvrir le modal pour éditer une promotion
  const openEditModal = (promotion) => {
    setFormData({
      titre: promotion.titre,
      description: promotion.description || '',
      produit_id: promotion.produit_id,
      prix_promo: promotion.prix_promo,
      date_debut: promotion.date_debut ? new Date(promotion.date_debut).toISOString().split('T')[0] : '',
      date_fin: promotion.date_fin ? new Date(promotion.date_fin).toISOString().split('T')[0] : '',
      type_promo: promotion.type_promo,
      actif: promotion.actif
    });
    setIsEditing(true);
    setCurrentPromotionId(promotion.id);
    setFormError('');
    setShowModal(true);
  };
  
  // Gérer le changement dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.produit_id || !formData.prix_promo) {
      setFormError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setSubmitting(true);
      setFormError('');
      
      if (isEditing) {
        // Mettre à jour une promotion existante
        await apiClient.put(`/vendor/promotions/${currentPromotionId}`, formData);
        setSuccessMessage('Promotion mise à jour avec succès');
      } else {
        // Créer une nouvelle promotion
        await apiClient.post('/vendor/promotions', formData);
        setSuccessMessage('Promotion créée avec succès');
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      fetchPromotions(currentPage);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setFormError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Supprimer une promotion
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      return;
    }
    
    try {
      await apiClient.delete(`/vendor/promotions/${id}`);
      setSuccessMessage('Promotion supprimée avec succès');
      fetchPromotions(currentPage);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression de la promotion:', err);
      setError('Impossible de supprimer la promotion. Veuillez réessayer plus tard.');
    }
  };
  
  // Activer/désactiver une promotion
  const toggleStatus = async (id) => {
    try {
      await apiClient.put(`/vendor/promotions/${id}/toggle-status`);
      fetchPromotions(currentPage);
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      setError('Impossible de changer le statut de la promotion. Veuillez réessayer plus tard.');
    }
  };
  
  // Formater le type de promotion pour l'affichage
  const formatPromoType = (type) => {
    const typeObj = promoTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };
  
  // Formater le statut pour l'affichage
  const getStatusBadge = (active) => {
    return active ? 
      <Badge bg="success">Actif</Badge> : 
      <Badge bg="secondary">Inactif</Badge>;
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des Promotions</h2>
        <Button 
          variant="primary" 
          onClick={openCreateModal}
          style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
        >
          <i className="bi bi-plus-circle me-1"></i> Créer une promotion
        </Button>
      </div>
      
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Liste des Promotions</h6>
          <div className="d-flex">
            <Form.Select 
              className="me-2" 
              value={filterType} 
              onChange={(e) => handleFilterChange(e, 'type')}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Tous les types</option>
              {promoTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Form.Select>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => handleFilterChange(e, 'status')}
              style={{ maxWidth: '150px' }}
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Chargement des promotions...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="table-striped">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Produit</th>
                      <th>Type</th>
                      <th>Prix Normal</th>
                      <th>Prix Promo</th>
                      <th>Réduction</th>
                      <th>Début</th>
                      <th>Fin</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.length > 0 ? (
                      promotions.map((promotion) => (
                        <tr key={promotion.id}>
                          <td>{promotion.titre}</td>
                          <td >
                            {promotion.produit ? (
                              <Link to={`/produits/${promotion.produit.id}`} style={{textDecoration:'none', color:'black'}}>
                                {promotion.produit.nom}
                              </Link>
                            ) : 'N/A'}
                          </td>
                          <td>{formatPromoType(promotion.type_promo)}</td>
                          <td>{promotion.prix_normal.toLocaleString()} FCFA</td>
                          <td>{promotion.prix_promo.toLocaleString()} FCFA</td>
                          <td>{Number(promotion.pourcentage_reduction).toFixed(2)}%</td>
                          <td>{formatDate(promotion.date_debut)}</td>
                          <td>{formatDate(promotion.date_fin)}</td>
                          <td>{getStatusBadge(promotion.actif)}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => openEditModal(promotion)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant={promotion.actif ? "outline-secondary" : "outline-success"} 
                              size="sm" 
                              className="me-1"
                              onClick={() => toggleStatus(promotion.id)}
                            >
                              <i className={`bi ${promotion.actif ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(promotion.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          Aucune promotion trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Modal de création/édition de promotion */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#FF6F00', color: 'white' }}>
          <Modal.Title>{isEditing ? 'Modifier la promotion' : 'Créer une promotion'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Produit <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="produit_id"
                    value={formData.produit_id}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing}
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.titre} - {product.prix.toLocaleString()} FCFA
                      </option>
                    ))}
                  </Form.Select>
                  {isEditing && (
                    <Form.Text className="text-muted">
                      Le produit ne peut pas être modifié après la création de la promotion.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix Promotionnel <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="prix_promo"
                    value={formData.prix_promo}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de Promotion</Form.Label>
                  <Form.Select
                    name="type_promo"
                    value={formData.type_promo}
                    onChange={handleInputChange}
                  >
                    {promoTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de Début</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_fin"
                    value={formData.date_fin}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Actif"
                name="actif"
                checked={formData.actif}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={submitting}
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
                Enregistrement...
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendorPromotions;
