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
    addToCart: (produit, quantity = 1) => {
      const cart = cartService.getCart();
      const existingItemIndex = cart.findIndex(item => item.id === produit.id);
      
      if (existingItemIndex !== -1) {
        // Si le produit existe déjà, augmenter la quantité
        cart[existingItemIndex].quantite += quantity;
      } else {
        // Sinon, ajouter le nouveau produit
        cart.push({
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          image: produit.image,
          vendeur: produit.vendeur?.nom || 'Ytoy Marketplace',
          quantite: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      notifyCartUpdated();
      
      return cart;
    },
    
    // Mettre à jour la quantité d'un produit
    updateQuantity: (produitId, quantity) => {
      const cart = cartService.getCart();
      const updatedCart = cart.map(item => 
        item.id === produitId ? { ...item, quantite: quantity } : item
      );
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      notifyCartUpdated();
      
      return updatedCart;
    },
    
    // Supprimer un produit du panier
    removeFromCart: (produitId) => {
      const cart = cartService.getCart();
      const updatedCart = cart.filter(item => item.id !== produitId);
      
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