import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    pays: '',
    code_postal: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        prenom: currentUser.prenom || '',
        nom: currentUser.nom || '',
        email: currentUser.email || '',
        telephone: currentUser.telephone || '',
        adresse: currentUser.adresse || '',
        ville: currentUser.ville || '',
        pays: currentUser.pays || '',
        code_postal: currentUser.code_postal || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put('/profile', formData);
      
      if (response.data) {
        setSuccess('Profil mis à jour avec succès!');
        // Mettre à jour le contexte d'authentification si nécessaire
        if (updateUserProfile) {
          updateUserProfile(response.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put('/profile/password', {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.confirm_password
      });
      
      if (response.data) {
        setSuccess('Mot de passe mis à jour avec succès!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mon Profil</h2>
        <Link to="/acheteur/dashboard" className="btn btn-outline-primary">
          Retour au tableau de bord
        </Link>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Menu</Card.Header>
            <Card.Body>
              <div className="list-group">
                <Link to="/acheteur/dashboard" className="list-group-item list-group-item-action">
                  <i className="bi bi-speedometer2 me-2"></i>Tableau de bord
                </Link>
                <Link to="/acheteur/profile" className="list-group-item list-group-item-action active">
                  <i className="bi bi-person me-2"></i>Éditer le profil
                </Link>
                <Link to="/acheteur/orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-bag me-2"></i>Mes commandes
                </Link>
                <Link to="/acheteur/wishlist" className="list-group-item list-group-item-action">
                  <i className="bi bi-heart me-2"></i>Liste de souhaits
                </Link>
                <Link to="/acheteur/addresses" className="list-group-item list-group-item-action">
                  <i className="bi bi-geo-alt me-2"></i>Mes adresses
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Informations personnelles</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
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
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Mettre à jour le profil'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5">Changer le mot de passe</Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe actuel</Form.Label>
                  <Form.Control
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <Form.Text className="text-muted">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="danger" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Changer le mot de passe'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
};

export default Profile;
