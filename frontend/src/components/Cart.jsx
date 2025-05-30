import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Début de la récupération du panier');
      const response = await apiClient.get('/api/panier');
      console.log('Réponse du serveur:', {
        status: response.status,
        data: response.data
      });
      setCartItems(response.data.produits || []);
      setError('');
    } catch (err) {
      console.error('Erreur détaillée:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      setError('Impossible de charger votre panier. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
      console.log('Fin de la récupération du panier');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await apiClient.put('/api/panier/update', {
        produit_id: productId,  // Correction du nom du paramètre
        quantite: quantity      // Correction du nom du paramètre
      });
      fetchCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité', error);
      setError('Erreur lors de la mise à jour de la quantité');
    }
  };

  const removeItem = async (productId) => {
    try {
      await apiClient.delete(`/api/panier/remove/${productId}`);
      fetchCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error);
      setError('Erreur lors de la suppression du produit');
    }
  };

  const checkout = async () => {
    try {
      // Vous devrez probablement ajouter les informations de livraison, etc.
      await apiClient.post('/api/panier/checkout', {
        adresse_livraison: 'Adresse par défaut', // À ajuster selon votre formulaire
        phone: '123456789', // À ajuster selon votre formulaire
        notes: '' // Optionnel
      });
      navigate('/orders'); // Rediriger vers la page des commandes
    } catch (error) {
      console.error('Erreur lors de la création de la commande', error);
      setError('Erreur lors de la création de la commande');
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  // Calcul du total en utilisant les propriétés correctes (prix et quantite)
  const total = cartItems.reduce((sum, item) => sum + (item.prix * item.pivot.quantite), 0);

  return (
    <Container className="my-4">
      <h2 className="mb-4">Mon Panier</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {cartItems.length === 0 ? (
        <Alert variant="info">
          Votre panier est vide. <Button variant="link" onClick={() => navigate('/products')}>Continuer vos achats</Button>
        </Alert>
      ) : (
        <>
          <Table responsive>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].url}
                          alt={item.nom}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '10px'
                          }}
                        />
                      ) : (
                        <img
                          src="/default-image.png"
                          alt="Image par défaut"
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '10px'
                          }}
                        />
                      )}
                      {item.nom}
                    </div>
                  </td>
                  <td>{item.prix} FCFA</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.pivot.quantite - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.pivot.quantite}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.pivot.quantite + 1)}
                        disabled={item.pivot.quantite >= item.quantite_stock}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{item.prix * item.pivot.quantite} FCFA</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end"><strong>Total</strong></td>
                <td><strong>{total} FCFA</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={() => navigate('/products')}>
              Continuer vos achats
            </Button>
            <Button variant="primary" onClick={checkout}>
              Passer la commande
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;