import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Tab, Nav } from 'react-bootstrap';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VendorSettings = () => {
  const { currentUser, updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Informations du profil
  const [profileData, setProfileData] = useState({
    nom_boutique: '',
    description: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    logo: null,
    banner: null
  });
  
  // Paramètres de paiement
  const [paymentData, setPaymentData] = useState({
    payment_method: 'bank_transfer',
    bank_name: '',
    account_holder: '',
    iban: '',
    bic: '',
    paypal_email: ''
  });
  
  // Paramètres de notification
  const [notificationData, setNotificationData] = useState({
    notify_new_order: true,
    notify_order_status: true,
    notify_low_stock: true,
    notify_review: true,
    notify_message: true,
    email_notifications: true,
    sms_notifications: false
  });
  
  useEffect(() => {
    if (currentUser?.vendeur) {
      // Initialiser les données du profil avec les informations existantes
      setProfileData({
        nom_boutique: currentUser.vendeur.nom_boutique || '',
        description: currentUser.vendeur.description || '',
        email: currentUser.email || '',
        telephone: currentUser.telephone || '',
        adresse: currentUser.vendeur.adresse || '',
        ville: currentUser.vendeur.ville || '',
        code_postal: currentUser.vendeur.code_postal || '',
        pays: currentUser.vendeur.pays || 'France',
        logo: null,
        banner: null
      });
      
      // Charger les paramètres complets depuis l'API
      fetchSettings();
    }
  }, [currentUser]);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/vendor/settings');
      
      if (response.data) {
        // Mettre à jour les paramètres de paiement
        if (response.data.payment) {
          setPaymentData({
            payment_method: response.data.payment.payment_method || 'bank_transfer',
            bank_name: response.data.payment.bank_name || '',
            account_holder: response.data.payment.account_holder || '',
            iban: response.data.payment.iban || '',
            bic: response.data.payment.bic || '',
            paypal_email: response.data.payment.paypal_email || ''
          });
        }
        
        // Mettre à jour les paramètres de notification
        if (response.data.notifications) {
          setNotificationData({
            notify_new_order: response.data.notifications.notify_new_order ?? true,
            notify_order_status: response.data.notifications.notify_order_status ?? true,
            notify_low_stock: response.data.notifications.notify_low_stock ?? true,
            notify_review: response.data.notifications.notify_review ?? true,
            notify_message: response.data.notifications.notify_message ?? true,
            email_notifications: response.data.notifications.email_notifications ?? true,
            sms_notifications: response.data.notifications.sms_notifications ?? false
          });
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres', err);
      setError('Impossible de charger vos paramètres. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfileData({
      ...profileData,
      [name]: files[0]
    });
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked, type, value } = e.target;
    setNotificationData({
      ...notificationData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const saveSettings = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      setError('');
      
      // Préparer les données à envoyer
      const formData = new FormData();
      
      // Ajouter les données du profil
      Object.keys(profileData).forEach(key => {
        if (key === 'logo' || key === 'banner') {
          if (profileData[key]) {
            formData.append(key, profileData[key]);
          }
        } else {
          formData.append(key, profileData[key]);
        }
      });
      
      // Ajouter les données de paiement
      formData.append('payment', JSON.stringify(paymentData));
      
      // Ajouter les données de notification
      formData.append('notifications', JSON.stringify(notificationData));
      
      // Envoyer les données
      const response = await apiClient.post('/api/vendor/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data) {
        setSaveSuccess(true);
        
        // Mettre à jour les informations utilisateur dans le contexte
        if (response.data.user) {
          updateUserInfo(response.data.user);
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des paramètres', err);
      setError('Erreur lors de l\'enregistrement de vos paramètres. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Paramètres de la Boutique</h2>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {saveSuccess && <Alert variant="success">Vos paramètres ont été enregistrés avec succès!</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="profile"
                      className="d-flex align-items-center"
                      style={{ color: activeTab === 'profile' ? 'white' : '#FF6F00', backgroundColor: activeTab === 'profile' ? '#FF6F00' : 'transparent' }}
                    >
                      <i className="bi bi-shop me-2"></i> Profil de la Boutique
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="payment"
                      className="d-flex align-items-center"
                      style={{ color: activeTab === 'payment' ? 'white' : '#FF6F00', backgroundColor: activeTab === 'payment' ? '#FF6F00' : 'transparent' }}
                    >
                      <i className="bi bi-credit-card me-2"></i> Paramètres de Paiement
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="notifications"
                      className="d-flex align-items-center"
                      style={{ color: activeTab === 'notifications' ? 'white' : '#FF6F00', backgroundColor: activeTab === 'notifications' ? '#FF6F00' : 'transparent' }}
                    >
                      <i className="bi bi-bell me-2"></i> Notifications
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <h4 className="mb-3">Informations de la Boutique</h4>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom de la Boutique</Form.Label>
                            <Form.Control
                              type="text"
                              name="nom_boutique"
                              value={profileData.nom_boutique}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description de la Boutique</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={profileData.description}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                              type="tel"
                              name="telephone"
                              value={profileData.telephone}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control
                              type="text"
                              name="adresse"
                              value={profileData.adresse}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ville</Form.Label>
                            <Form.Control
                              type="text"
                              name="ville"
                              value={profileData.ville}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Code Postal</Form.Label>
                            <Form.Control
                              type="text"
                              name="code_postal"
                              value={profileData.code_postal}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pays</Form.Label>
                            <Form.Control
                              type="text"
                              name="pays"
                              value={profileData.pays}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Logo de la Boutique</Form.Label>
                            <Form.Control
                              type="file"
                              name="logo"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                            <Form.Text className="text-muted">
                              Format recommandé: 200x200px, JPG ou PNG
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bannière de la Boutique</Form.Label>
                            <Form.Control
                              type="file"
                              name="banner"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                            <Form.Text className="text-muted">
                              Format recommandé: 1200x300px, JPG ou PNG
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="payment">
                    <h4 className="mb-3">Paramètres de Paiement</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Méthode de Paiement Préférée</Form.Label>
                        <Form.Select
                          name="payment_method"
                          value={paymentData.payment_method}
                          onChange={handlePaymentChange}
                        >
                          <option value="bank_transfer">Virement Bancaire</option>
                          <option value="paypal">PayPal</option>
                        </Form.Select>
                      </Form.Group>
                      
                      {paymentData.payment_method === 'bank_transfer' && (
                        <>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nom de la Banque</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="bank_name"
                                  value={paymentData.bank_name}
                                  onChange={handlePaymentChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Titulaire du Compte</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="account_holder"
                                  value={paymentData.account_holder}
                                  onChange={handlePaymentChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>IBAN</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="iban"
                                  value={paymentData.iban}
                                  onChange={handlePaymentChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>BIC/SWIFT</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="bic"
                                  value={paymentData.bic}
                                  onChange={handlePaymentChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      )}
                      
                      {paymentData.payment_method === 'paypal' && (
                        <Form.Group className="mb-3">
                          <Form.Label>Email PayPal</Form.Label>
                          <Form.Control
                            type="email"
                            name="paypal_email"
                            value={paymentData.paypal_email}
                            onChange={handlePaymentChange}
                          />
                        </Form.Group>
                      )}
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="notifications">
                    <h4 className="mb-3">Paramètres de Notification</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="notify_new_order"
                          name="notify_new_order"
                          label="Nouvelles commandes"
                          checked={notificationData.notify_new_order}
                          onChange={handleNotificationChange}
                        />
                        <Form.Text className="text-muted">
                          Recevoir une notification pour chaque nouvelle commande
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="notify_order_status"
                          name="notify_order_status"
                          label="Changements de statut des commandes"
                          checked={notificationData.notify_order_status}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="notify_low_stock"
                          name="notify_low_stock"
                          label="Alerte de stock bas"
                          checked={notificationData.notify_low_stock}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="notify_review"
                          name="notify_review"
                          label="Nouveaux avis clients"
                          checked={notificationData.notify_review}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="notify_message"
                          name="notify_message"
                          label="Nouveaux messages"
                          checked={notificationData.notify_message}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <hr />
                      
                      <h5 className="mb-3">Canaux de notification</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="email_notifications"
                          name="email_notifications"
                          label="Notifications par email"
                          checked={notificationData.email_notifications}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="sms_notifications"
                          name="sms_notifications"
                          label="Notifications par SMS"
                          checked={notificationData.sms_notifications}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="primary" 
              onClick={saveSettings}
              disabled={loading}
              style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
            >
              {loading ? (
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
                'Enregistrer les modifications'
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VendorSettings;
