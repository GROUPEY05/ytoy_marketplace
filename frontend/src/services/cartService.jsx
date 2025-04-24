// Un service pour gérer les opérations du panier de manière centralisée

// Événement personnalisé pour notifier les changements du panier
const notifyCartUpdated = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  const cartService = {
    // Récupérer tous les articles du panier
    getCart: () => {
      return JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    // Ajouter un produit au panier
    addToCart: (product, quantity = 1) => {
      const cart = cartService.getCart();
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Si le produit existe déjà, augmenter la quantité
        cart[existingItemIndex].quantite += quantity;
      } else {
        // Sinon, ajouter le nouveau produit
        cart.push({
          id: product.id,
          nom: product.nom,
          prix: product.prix,
          image: product.image,
          vendeur: product.vendeur?.nom || 'Ytoy Marketplace',
          quantite: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      notifyCartUpdated();
      
      return cart;
    },
    
    // Mettre à jour la quantité d'un produit
    updateQuantity: (productId, quantity) => {
      const cart = cartService.getCart();
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantite: quantity } : item
      );
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      notifyCartUpdated();
      
      return updatedCart;
    },
    
    // Supprimer un produit du panier
    removeFromCart: (productId) => {
      const cart = cartService.getCart();
      const updatedCart = cart.filter(item => item.id !== productId);
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      notifyCartUpdated();
      
      return updatedCart;
    },
    
    // Vider entièrement le panier
    clearCart: () => {
      localStorage.setItem('cart', JSON.stringify([]));
      notifyCartUpdated();
      
      return [];
    },
    
    // Calculer le nombre total d'articles dans le panier
    getCartCount: () => {
      const cart = cartService.getCart();
      return cart.reduce((sum, item) => sum + item.quantite, 0);
    },
    
    // Calculer le sous-total du panier
    getSubtotal: () => {
      const cart = cartService.getCart();
      return cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    }
  };
  
  export default cartService;