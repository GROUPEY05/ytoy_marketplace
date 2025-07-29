import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    telephone: '',
    est_defaut: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.get('/addresses');
      
      if (response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error);
      setError('Impossible de charger vos adresses. Veuillez réessayer plus tard.');
      
      // En cas d'erreur, utiliser des données fictives pour la démo
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: '',
      telephone: '',
      est_defaut: false
    });
  };

  const handleAddAddress = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setFormData({
      titre: address.titre || '',
      adresse: address.adresse || '',
      ville: address.ville || '',
      code_postal: address.code_postal || '',
      pays: address.pays || '',
      telephone: address.telephone || '',
      est_defaut: address.est_defaut || false
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.post('/addresses', formData);
      
      if (response.data) {
        setAddresses([...addresses, response.data]);
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      setError('Impossible d\'ajouter cette adresse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.put(`/addresses/${currentAddress.id}`, formData);
      
      if (response.data) {
        setAddresses(addresses.map(addr => 
          addr.id === currentAddress.id ? response.data : addr
        ));
        setShowEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'adresse:', error);
      setError('Impossible de modifier cette adresse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse?')) {
      return;
    }
    
    try {
      await apiClient.delete(`/addresses/${addressId}`);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
      setError('Impossible de supprimer cette adresse. Veuillez réessayer.');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await apiClient.put(`/addresses/${addressId}/default`);
      
      // Mettre à jour l'état local
      setAddresses(addresses.map(addr => ({
        ...addr,
        est_defaut: addr.id === addressId
      })));
    } catch (error) {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
      setError('Impossible de définir cette adresse comme adresse par défaut.');
    }
  };

  // Formulaire d'adresse réutilisable
  const AddressForm = ({ onSubmit, buttonText }) => (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Titre de l'adresse</Form.Label>
        <Form.Control
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Ex: Domicile, Bureau, etc."
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Adresse</Form.Label>
        <Form.Control
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Code postal</Form.Label>
            <Form.Control
              type="text"
              name="code_postal"
              value={formData.code_postal}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Pays</Form.Label>
        <Form.Control
          type="text"
          name="pays"
          value={formData.pays}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Téléphone</Form.Label>
        <Form.Control
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="est_defaut"
          label="Définir comme adresse par défaut"
          checked={formData.est_defaut}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : buttonText}
        </Button>
      </div>
    </Form>
  );

  return (
    <>
      <Header />
      <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mes Adresses</h2>
        <div>
          <Button variant="success" onClick={handleAddAddress} className="me-2">
            <i className="bi bi-plus-circle me-1"></i> Ajouter une adresse
          </Button>
          <Link to="/acheteur/dashboard" className="btn btn-outline-primary">
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && addresses.length === 0 ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement de vos adresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-geo-alt fs-1 text-muted mb-3"></i>
            <h4>Vous n'avez pas encore ajouté d'adresse</h4>
            <p className="text-muted">Ajoutez une adresse pour faciliter vos futures commandes.</p>
            <Button variant="primary" onClick={handleAddAddress} className="mt-3">
              Ajouter une adresse
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {addresses.map(address => (
            <Col md={6} lg={4} key={address.id} className="mb-4">
              <Card className={address.est_defaut ? 'border-primary' : ''}>
                {address.est_defaut && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <Badge bg="primary">Par défaut</Badge>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>{address.titre}</Card.Title>
                  <Card.Text>
                    {address.adresse}<br />
                    {address.code_postal} {address.ville}<br />
                    {address.pays}<br />
                    <strong>Tél:</strong> {address.telephone}
                  </Card.Text>
                  <div className="d-flex justify-content-between mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => handleEditAddress(address)}
                    >
                      <i className="bi bi-pencil me-1"></i> Modifier
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Supprimer
                    </Button>
                  </div>
                  {!address.est_defaut && (
                    <div className="d-grid mt-2">
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Définir par défaut
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal pour ajouter une adresse */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une adresse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddressForm onSubmit={handleSubmitAdd} buttonText="Ajouter l'adresse" />
        </Modal.Body>
      </Modal>

      {/* Modal pour modifier une adresse */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'adresse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddressForm onSubmit={handleSubmitEdit} buttonText="Enregistrer les modifications" />
        </Modal.Body>
      </Modal>
    </Container>
    <Footer />
    </>
  );
};

export default Addresses;
