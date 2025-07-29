import React, { useState, useEffect } from 'react'
import { Modal, Button, Table, Form } from 'react-bootstrap'
import { apiClient } from '../../services/api'
import useCartStore from '../../store/cartStore'
import './CartModal.css'
import orangeLogo from '../../assets/orange.jpeg'
import carteLogo from '../../assets/carte.jpeg'
import especeLogo from '../../assets/especes.png'
import mobileMoneyLogo from '../../assets/mtn.jpeg'

const CartModal = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isCartModalOpen, setCartModalOpen } = useCartStore()
  const [adresseLivraison, setAdresseLivraison] = useState('')
  const [methodePaiement, setMethodePaiement] = useState('mobile_money')
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  // Utiliser une image locale pour l'image par défaut
  const [defaultImage, setDefaultImage] = useState(
    'http://149.202.43.206/assets/placeholder.png'
  )
  const logoMap = {
    mobile_money: mobileMoneyLogo,
    orange_money: orangeLogo,
    carte: carteLogo,
    especes: especeLogo
  }
  const labelMap = {
    mobile_money: 'Mobile Money',
    orange_money: 'Orange Money',
    carte: 'Carte bancaire',
    especes: 'Espèces'
  }

  // Pas besoin de précharger l'image par défaut car nous utilisons une image locale

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/panier')
      console.log('Réponse du panier:', response.data) // Pour le débogage

      // Si le backend renvoie un format différent, adapter cette partie
      const produitsAvecImages = (response.data.produits || []).map(produit => {
        // Vérifier la structure des données pour le débogage
        console.log('Structure du produit:', produit)

        let imageUrl = defaultImage

        if (produit.images && produit.images.length > 0) {
          const firstImage = produit.images[0]

          if (typeof firstImage === 'string') {
            if (firstImage.startsWith('/storage/')) {
              imageUrl = `http://149.202.43.206${firstImage}`
            } else {
              imageUrl = `http://149.202.43.206/storage/${firstImage}`
            }
          } else if (firstImage.url) {
            if (firstImage.url.startsWith('/storage/')) {
              imageUrl = `http://149.202.43.206${firstImage.url}`
            } else {
              imageUrl = `http://149.202.43.206/storage/${firstImage.url}`
            }
          }
        } else if (produit.image_principale) {
          if (produit.image_principale.startsWith('/storage/')) {
            imageUrl = `http://149.202.43.206${produit.image_principale}`
          } else {
            imageUrl = `http://149.202.43.206/storage/${produit.image_principale}`
          }
        } else if (produit.image_url) {
          if (produit.image_url.startsWith('/storage/')) {
            imageUrl = `http://149.202.43.206${produit.image_url}`
          } else {
            imageUrl = `http://149.202.43.206/storage/${produit.image_url}`
          }
        }

        // Pour le débogage
        console.log("URL de l'image:", imageUrl)

        return {
          ...produit,
          imageUrl: imageUrl
        }
      })

      setCartItems(produitsAvecImages)
      setError('')
    } catch (err) {
      console.error('Erreur lors du chargement du panier', err)
      setError('Impossible de charger le panier')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isCartModalOpen) {
      fetchCartItems()
    }
  }, [isCartModalOpen])

  const handleClose = () => {
    setCartModalOpen(false)
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    // Vérifier que la quantité est valide
    if (newQuantity <= 0) {
      setError('La quantité doit être supérieure à 0')
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.put('/panier/update', {
        produit_id: productId,
        quantite: newQuantity
      })
      console.log('Réponse mise à jour quantité:', response.data) // Pour le débogage
      window.dispatchEvent(new Event('cartUpdated'))
      await fetchCartItems()
      setError('') // Effacer les erreurs précédentes en cas de succès
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité', error)
      setError(
        error.response?.data?.message ||
          'Erreur lors de la mise à jour de la quantité'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async productId => {
    try {
      await apiClient.delete(`/panier/remove/${productId}`)
      window.dispatchEvent(new Event('cartUpdated'))
      fetchCartItems()
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error)
      setError('Erreur lors de la suppression du produit')
    }
  }

  const handleCheckout = async () => {
    if (!adresseLivraison) {
      setError('Veuillez fournir une adresse de livraison')
      return
    }

    try {
      setLoading(true)

      // Vérifier si l'utilisateur est authentifié
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Vous devez être connecté pour passer une commande')
        setLoading(false)
        return
      }

      // Créer une commande directement à partir du panier actuel
      const orderData = {
        adresse_livraison: adresseLivraison,
        phone: '0000000000', // Numéro de téléphone par défaut
        notes: ''
      }

      console.log('Données de commande:', orderData)

      // Utiliser une route plus simple qui ne nécessite pas de middleware complexe
      const response = await apiClient.post('/panier/checkout', orderData)

      console.log('Réponse création commande:', response.data)

      if (response.status === 200 || response.status === 201) {
        alert('Commande créée avec succès!')
        setCartModalOpen(false)
        window.dispatchEvent(new Event('cartUpdated'))
        setAdresseLivraison('')
        setMethodePaiement('mobile_money')
        setShowCheckoutForm(false)
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande', error)
      setError(
        'Erreur lors de la création de la commande: ' +
          (error.response?.data?.message || error.message)
      )
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.prix * item.pivot.quantite
    }, 0)
  }

  return (
    <Modal show={isCartModalOpen} onHide={handleClose} size='lg' centered>
      <Modal.Header closeButton>
        <Modal.Title>Mon Panier</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <div className='alert alert-danger'>{error}</div>}

        {loading ? (
          <div className='text-center py-4'>
            <div className='spinner'></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className='empty-cart'>
            <i className='bi bi-cart-x'></i>
            <p>Votre panier est vide</p>
          </div>
        ) : (
          <div className='cart-items'>
            {cartItems.map(item => (
              <div key={item.id} className='cart-item'>
                <div className='item-image'>
                  <div className='image-panier'>
                    <img
                      src={item.imageUrl || defaultImage}
                      alt={item.nom || 'Produit'}
                      className='cart-item-image'
                      onError={e => {
                        console.log('Erreur de chargement image:', e.target.src)
                        // Utiliser une image locale en cas d'erreur
                        e.target.src = '/assets/placeholder.png'
                        // Si l'image locale ne fonctionne pas, utiliser une image en base64
                        e.target.onerror = () => {
                          e.target.src =
                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAEzElEQVR4nO2dW4hVVRjHf2fGcZwZL6UplZZGKkaiBYWXMJCywJCQgkqyh4pIqOnBSsHoQpAPUhH0EF0w6cVLlwchkYIsEiGhFLpQmpaGl7xMOjqjc/n3sM+hM87MWfvs2+rL+sGCzey9vrW+/z57nbXXXnuDYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRhGWlDSBQDMmDGjsaOjY7GqLgKagGZVbRaRZuA+YKKITFTVicBEEWkAMBgMZkZGRm6JyC1gQFVvisgNVb0hIjdEpF9V+0XkuojsB/YfPnz4j0QaGJN5QJYtW/aEqq4VkbXAHBHJuK5TVYeBXlXdLSI7tm/ffth1nS7INSCrV69e0NnZ+ZaqvgBkXdfjmAER2bxly5bPtm3b1p90MWMJPSAtLS1ZEXkNaAOWhF1fAvQCH2cymc1dXV23ky5mNKEFZM2aNQ+r6jbgKRGpD6uehOkDXu/u7v4q6UJGCCUgra2tT6vqDhG5P4z6UsSPwLrt27cfSroQCDggbW1tDf39/R+JyEtB1pNyhoF3Ozo63k+ykMAC0tbW1jAwMPCNiDwbVB0jjO3Z2dnnd+3aNRREZYEEZOXKlRNVdbeIPB5E/WPwJ3BGRM6KyDkROQf8LSL/ALeB2yIyAUBEJgCTgEkiMkVVp4rIdBGZDswCHgQaQ6jvQGNj4+Ldu3ffcl2x84CsWrVqkqruE5GHXNc9iqvAARE5ICIHVPWoiAw5qnsSME9VHxGRR4GFwGwXFYvIwYaGhsd6enr+c1GfE5YvX14vIj8Aj7msdxRXgG9FZKeq7hWRoRDrBkBEpgNrgHXAMlz1LiKHVHVxT0/PbRf1OWH58uX1wE/AIhd1jmIvsFlVvxeR4RDrdSIiC4DXgJeBqQ6qPCIiC3t7e4NJFUZYtmzZBOAXYL6L+kaRBz5X1Q9F5FyIdTpHRJqAV4G3gWkBV39cVR/p7e0NLlUoYenSpVngIDA3qLpGcRn4UFU/EZGbIdUZOCIyFXgHeAOYHGDVJ1X1od7e3uAThSKWLFmSBX4FFgRV1yj2A2+q6tGQ6gsNEZkNfAI8F1CVZ1X1gd7e3nBShCKWLFmSBY4QTjAGgXdV9fOkb1iCQkSeBz4Gmlyf1ojIeVWd3dfXF16KUMSCBZ4/DhPOtaMP+EBVt4rIvyHUlxgi0gBsAl7F/TXmkqre19fXF26KUMTChQvrgWPAgy7rGsVBYIOqHgmhrsQRkUXAF8Acl/Wq6syDBw+GnyIUsWDBgixwCvfBOAO8rKq/Oq4nVYhIHfAh0Oa4qgdOnDgRTYpQxPz587PAadwHY0BENgLbjh07FlmfHQYisgH4DLdPrWeeOnUquhShiHnz5mWBM7gPBsD7qvpVCPWkChF5BvgWt9eUGadPn44uRShi7ty5GeAcbh+tjnBZVV9R1Z8d15M6RGQWsBOY7qrOTCZz5syZM9GlCEXMmTMnA/Th/gYX4BNV/TSEelKFiNQDPwMLXdWZz+cvnD17NroUoYjZs2dnRGQAmOK4qqvAelXd47ieVCIiHwCbXNWXz+cvnj9/ProUwTAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzCM/wMPQI1nrWzXfQAAAABJRU5ErkJggg=='
                        }
                      }}
                    />
                  </div>
                </div>
                <div className='item-details'>
                  <h5>{item.nom || 'Produit'}</h5>
                  <p className='item-price'>{item.prix} FCFA</p>
                </div>
                <div className='item-quantity'>
                  <div className='quantity-controls'>
                    <button
                      type='button'
                      className='quantity-btn'
                      onClick={() => {
                        const currentQty = item.pivot?.quantite || 1
                        if (currentQty > 1) {
                          handleQuantityChange(item.id, currentQty - 1)
                        }
                      }}
                    >
                      -
                    </button>
                    <span className='quantity-display'>
                      {item.pivot?.quantite || 1}
                    </span>
                    <button
                      type='button'
                      className='quantity-btn'
                      onClick={() => {
                        const currentQty = item.pivot?.quantite || 1
                        const maxQty = item.quantite_stock || 99
                        if (currentQty < maxQty) {
                          handleQuantityChange(item.id, currentQty + 1)
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className='item-total'>
                  {item.prix * item.pivot.quantite} FCFA
                </div>
                <Button
                  variant='link'
                  className='remove-button'
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <i className='bi bi-trash'></i>
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      {cartItems.length > 0 && (
        <Modal.Footer>
          <div className='cart-summary'>
            <div className='total-amount'>
              Total: <span>{calculateTotal()} FCFA</span>
            </div>
            {!showCheckoutForm ? (
              <div className='action-buttons'>
                <Button variant='secondary' onClick={handleClose}>
                  Continuer les achats
                </Button>
                <Button
                  className='checkout-button'
                  onClick={() => setShowCheckoutForm(true)}
                >
                  Passer la commande
                </Button>
              </div>
            ) : (
              <div className='checkout-form'>
                <Form.Group className='mb-3'>
                  <Form.Label>Adresse de livraison</Form.Label>
                  <Form.Control
                    type='text'
                    value={adresseLivraison}
                    onChange={e => setAdresseLivraison(e.target.value)}
                    placeholder='Entrez votre adresse de livraison'
                  />
                </Form.Group>
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold'>
                    Méthode de paiement
                  </Form.Label>
                  <Form.Select
                    value={methodePaiement}
                    onChange={e => setMethodePaiement(e.target.value)}
                  >
                    <option value='mobile_money'>Mobile Money</option>
                    <option value='orange_money'>Orange Money</option>
                    <option value='carte'>Carte bancaire</option>
                    <option value='especes'>Espèces</option>
                  </Form.Select>

                  <div className='mt-3 d-flex align-items-center gap-3'>
                    <img
                      src={logoMap[methodePaiement]}
                      alt={labelMap[methodePaiement]}
                      width={40}
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                    <span className='fs-6'>{labelMap[methodePaiement]}</span>
                  </div>
                </Form.Group>
                <div className='action-buttons'>
                  <Button
                    variant='secondary'
                    onClick={() => setShowCheckoutForm(false)}
                  >
                    Retour
                  </Button>
                  <Button className='checkout-button' onClick={handleCheckout}>
                    Confirmer la commande
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default CartModal
