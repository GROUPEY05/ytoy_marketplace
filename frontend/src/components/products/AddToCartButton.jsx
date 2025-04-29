import React, { useState } from 'react';
import { Button, Form, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import cartService from '../../services/cartService';

const AddToCartButton = ({ produit, showQuantity = true, size = "md", buttonText = "Ajouter au panier" }) => {
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Ajouter au panier avec la quantité spécifiée
    cartService.addToCart(produit, quantity);
    
    // Afficher le toast de confirmation
    setShowToast(true);
    
    // Réinitialiser l'état
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 300);
  };
  
  return (
    <>
      <div className="d-flex align-items-center">
        {showQuantity && (
          <InputGroup className="me-2" style={{ width: '120px' }}>
            <Button 
              variant="outline-secondary" 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Form.Control 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={handleQuantityChange}
              className="text-center"
            />
            <Button 
              variant="outline-secondary" 
              onClick={increaseQuantity}
            >
              +
            </Button>
          </InputGroup>
        )}
        
        <Button 
          variant="primary"
          size={size}
          className="flex-grow-1"
          style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Ajout...
            </>
          ) : (
            <>
              <i className="bi bi-cart-plus me-2"></i>
              {buttonText}
            </>
          )}
        </Button>
      </div>
      
      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg="success"
          text="white"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Produit ajouté</strong>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <img 
                src={produit.image || '/placeholder-product.jpg'} 
                alt={produit.nom} 
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                className="me-2"
              />
              <div>
                <div>{produit.nom}</div>
                <small>Quantité: {quantity}</small>
              </div>
            </div>
            <div className="mt-2">
              <Button 
                as="a" 
                href="/cart" 
                variant="light" 
                size="sm" 
                className="me-2 text-decoration-none"
              >
                Voir mon panier
              </Button>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AddToCartButton;