// src/utils/formatUtils.js

// Fonction pour formater une date en format lisible
export function formatDate(dateString) {
    if (!dateString) return 'Date inconnue';
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
  
    return date.toLocaleDateString('fr-FR', options);
  }
  
  // Fonction pour formater un prix avec le symbole € et 2 décimales
  export function formatPrice(amount) {
    if (amount == null) return '0,00 €';
  
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  