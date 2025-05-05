// import React, { useState, useEffect } from 'react';
// import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { apiClient } from '../../services/api';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       console.log('Début de la récupération du panier');
//       const response = await apiClient.get('/api/panier');
//       console.log('Réponse du serveur:', {
//         status: response.status,
//         data: response.data
//       });
//       setCartItems(response.data.produits || []);
//       setError('');
//     } catch (err) {
//       console.error('Erreur détaillée:', {
//         message: err.message,
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         data: err.response?.data,
//         config: {
//           url: err.config?.url,
//           method: err.config?.method,
//           headers: err.config?.headers
//         }
//       });
      
//       setError('Impossible de charger votre panier. Veuillez réessayer plus tard.');
//     } finally {
//       setLoading(false);
//       console.log('Fin de la récupération du panier');
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       await apiClient.put('/api/panier/update', {
//         product_id: productId,
//         quantity: quantity
//       });
//       fetchCart(); // Recharger le panier
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de la quantité', error);
//       setError('Erreur lors de la mise à jour de la quantité');
//     }
//   };

//   const removeItem = async (productId) => {
//     try {
//       await apiClient.delete(`/api/panier/remove/${productId}`);
//       fetchCart(); // Recharger le panier
//     } catch (error) {
//       console.error('Erreur lors de la suppression du produit', error);
//       setError('Erreur lors de la suppression du produit');
//     }
//   };

//   const checkout = async () => {
//     try {
//       await apiClient.post('api/orders/create');
//       navigate('/orders'); // Rediriger vers la page des commandes
//     } catch (error) {
//       console.error('Erreur lors de la création de la commande', error);
//       setError('Erreur lors de la création de la commande');
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center my-5">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Chargement...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   return (
//     <Container className="my-4">
//       <h2 className="mb-4">Mon Panier</h2>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {cartItems.length === 0 ? (
//         <Alert variant="info">
//           Votre panier est vide. <Button variant="link" onClick={() => navigate('/products')}>Continuer vos achats</Button>
//         </Alert>
//       ) : (
//         <>
//           <Table responsive>
//             <thead>
//               <tr>
//                 <th>Produit</th>
//                 <th>Prix unitaire</th>
//                 <th>Quantité</th>
//                 <th>Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map(item => (
//                 <tr key={item.id}>
//                   <td>
//                     <div className="d-flex align-items-center">
//                       {item.images && item.images[0] && (
//                         <img
//                           src={`http://localhost:8000/storage/${item.images[0].url}`}
//                           alt={item.title}
//                           style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
//                         />
//                       )}
//                       {item.title}
//                     </div>
//                   </td>
//                   <td>{item.price} FCFA</td>
//                   <td>
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="outline-secondary"
//                         size="sm"
//                         onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
//                       >
//                         -
//                       </Button>
//                       <span className="mx-2">{item.quantity}</span>
//                       <Button
//                         variant="outline-secondary"
//                         size="sm"
//                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                         disabled={item.quantity >= item.stock}
//                       >
//                         +
//                       </Button>
//                     </div>
//                   </td>
//                   <td>{item.price * item.quantity} FCFA</td>
//                   <td>
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       onClick={() => removeItem(item.id)}
//                     >
//                       Supprimer
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan="3" className="text-end"><strong>Total</strong></td>
//                 <td><strong>{total} FCFA</strong></td>
//                 <td></td>
//               </tr>
//             </tfoot>
//           </Table>

//           <div className="d-flex justify-content-between mt-4">
//             <Button variant="outline-secondary" onClick={() => navigate('/products')}>
//               Continuer vos achats
//             </Button>
//             <Button variant="primary" onClick={checkout}>
//               Passer la commande
//             </Button>
//           </div>
//         </>
//       )}
//     </Container>
//   );
// };

// export default Cart;
