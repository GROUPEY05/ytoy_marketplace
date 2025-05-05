import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid'
  },
  tableColHeader: {
    width: '25%',
    backgroundColor: '#F0F0F0',
    padding: 5
  },
  tableCol: {
    width: '25%',
    padding: 5
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  tableCell: {
    fontSize: 10
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center'
  }
});

// Composant PDF pour la facture
const InvoicePDF = ({ order, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Facture #{order.id}</Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.subheader}>Informations client</Text>
        <Text style={styles.text}>Nom: {user?.prenom || ''} {user?.nom || ''}</Text>
        <Text style={styles.text}>Email: {user?.email || ''}</Text>
        <Text style={styles.text}>Adresse de livraison: {order.adresse_livraison || 'Non spécifiée'}</Text>
      </View>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.subheader}>Informations commande</Text>
        <Text style={styles.text}>Commande #: {order.id}</Text>
        <Text style={styles.text}>Date: {new Date(order.date_commande || order.created_at).toLocaleDateString()}</Text>
        <Text style={styles.text}>Statut: {
          order.statut === 'en_attente' ? 'En attente' :
          order.statut === 'validee' ? 'Validée' :
          order.statut === 'en_preparation' ? 'En préparation' :
          order.statut === 'expediee' ? 'Expédiée' :
          order.statut === 'livree' ? 'Livrée' :
          order.statut === 'annulee' ? 'Annulée' : order.statut
        }</Text>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Produit</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Quantité</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Prix unitaire</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Total</Text>
          </View>
        </View>
        
        {order.lignes && order.lignes.map((ligne, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{ligne.produit?.nom || 'Produit non disponible'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{ligne.quantite}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{ligne.prix_unitaire} FCFA</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{ligne.prix_unitaire * ligne.quantite} FCFA</Text>
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.total}>Total: {order.montant_total} FCFA</Text>
      
      <Text style={styles.footer}>
        YToy Marketplace - Facture générée le {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

const Invoice = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(!location.state?.orderData);
  const [error, setError] = useState('');

  useEffect(() => {
    // Si nous avons déjà les données de commande via location.state, pas besoin de faire un appel API
    if (location.state?.orderData) {
      console.log('Utilisation des données de commande passées via location.state:', location.state.orderData);
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // Vérifier si l'ID est défini
        if (!id) {
          throw new Error('ID de commande non spécifié');
        }
        
        console.log('Tentative de récupération de la commande avec ID:', id);
        
        // Essayer plusieurs routes possibles pour récupérer les détails de la commande
        let orderData = null;
        
        try {
          const response = await apiClient.get(`/api/acheteur/orders/${id}`);
          console.log('Réponse de la première route:', response);
          if (response.data) {
            orderData = response.data;
          }
        } catch (firstError) {
          console.log('Erreur avec la première route, essai avec une autre route', firstError);
          
          try {
            const response = await apiClient.get(`/api/orders/${id}`);
            console.log('Réponse de la deuxième route:', response);
            if (response.data) {
              orderData = response.data;
            }
          } catch (secondError) {
            console.log('Erreur avec la deuxième route aussi', secondError);
            
            try {
              const response = await apiClient.get(`/api/panier/orders/${id}`);
              console.log('Réponse de la troisième route:', response);
              if (response.data) {
                orderData = response.data;
              }
            } catch (thirdError) {
              console.log('Erreur avec la troisième route aussi', thirdError);
              throw new Error('Impossible de récupérer les détails de la commande');
            }
          }
        }
        
        if (orderData) {
          console.log('Données de commande récupérées avec succès:', orderData);
          setOrder(orderData);
        } else {
          throw new Error('Commande non trouvée');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
        setError(`Impossible de charger les détails de la commande (ID: ${id || 'non défini'}). Veuillez réessayer plus tard.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, location.state]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la facture...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Link to="/acheteur/orders" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Commande non trouvée</Alert>
        <div className="text-center mt-3">
          <Link to="/acheteur/orders" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Facture #{order.id}</h2>
        <div>
          <PDFDownloadLink
            document={<InvoicePDF order={order} user={currentUser} />}
            fileName={`facture_${order.id}.pdf`}
            className="btn btn-primary me-2"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Préparation du PDF...' : 'Télécharger PDF'
            }
          </PDFDownloadLink>
          <Link to="/acheteur/orders" className="btn btn-outline-secondary">
            Retour aux commandes
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header as="h5">Informations de la commande</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Commande #:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.date_commande || order.created_at).toLocaleDateString()}</p>
              <p>
                <strong>Statut:</strong> {' '}
                <span className={`badge ${
                  order.statut === 'livree' ? 'bg-success' : 
                  order.statut === 'expediee' ? 'bg-primary' : 
                  order.statut === 'validee' ? 'bg-info' : 
                  order.statut === 'annulee' ? 'bg-danger' : 'bg-warning'
                }`}>
                  {order.statut === 'en_attente' ? 'En attente' :
                   order.statut === 'validee' ? 'Validée' :
                   order.statut === 'en_preparation' ? 'En préparation' :
                   order.statut === 'expediee' ? 'Expédiée' :
                   order.statut === 'livree' ? 'Livrée' :
                   order.statut === 'annulee' ? 'Annulée' : order.statut}
                </span>
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p><strong>Client:</strong> {currentUser.prenom} {currentUser.nom}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Adresse de livraison:</strong> {order.adresse_livraison}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Articles commandés</Card.Header>
        <Card.Body>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lignes && order.lignes.length > 0 ? (
                order.lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{ligne.produit?.nom || 'Produit non disponible'}</td>
                    <td>{ligne.quantite}</td>
                    <td>{ligne.prix_unitaire} FCFA</td>
                    <td className="text-end">{ligne.prix_unitaire * ligne.quantite} FCFA</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Aucun article disponible</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end"><strong>Total</strong></td>
                <td className="text-end"><strong>{order.montant_total} FCFA</strong></td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>

      {order.notes && (
        <Card className="mb-4">
          <Card.Header as="h5">Notes</Card.Header>
          <Card.Body>
            <p>{order.notes}</p>
          </Card.Body>
        </Card>
      )}

      <div className="text-center mt-4">
        <p className="text-muted">Merci pour votre achat chez YToy Marketplace!</p>
        <p className="text-muted small">Facture générée le {new Date().toLocaleDateString()}</p>
      </div>
    </Container>
    <Footer />
    </>
  );
};

export default Invoice;
