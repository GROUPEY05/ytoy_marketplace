
// export default MenuCategories;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdMenu } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
//  const API_URL = import.meta.env.VITE_API_URL;

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      // Endpoint actualisé - utilisation du même endpoint que celui utilisé par l'admin
      // mais sans l'authentification
      const response = await axios.get('http://149.202.43.206/api/categories');
      // const response = await axios.get(`${API_URL}/api/categories`);
      console.log('Réponse brute API:', response);
      console.log('Catégories récupérées:', response.data);
      
      // Vérifier si les données sont vides ou mal formatées
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Format de données incorrect:', response.data);
        setError('Format de données incorrect reçu du serveur');
        setLoading(false);
        return;
      }
      
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data);
      console.error('Statut HTTP:', err.response?.status);
      console.error('Message d\'erreur:', err.message);
      
      // Message d'erreur plus informatif
      if (err.response?.status === 404) {
        setError('L\'API de catégories n\'existe pas (404). Vérifiez la route API.');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur (500). Vérifiez les logs côté serveur.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Impossible de se connecter au serveur. Est-il démarré?');
      } else {
        setError(`Erreur: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  // Charger les catégories au chargement du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Afficher un message d'erreur plus détaillé
  if (loading) return <div>Chargement des catégories...</div>;
  if (error) return <div className="text-danger">Erreur: {error}</div>;

  return (
    <div className='dropdown'>
      <button className='btn btn-white' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
        <MdMenu style={{ fontSize: '30px' }} />
      </button>
      <ul className='dropdown-menu'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id}>
              <button
                className='dropdown-item'
                type='button'
                onClick={() => navigate(`/categorie/${encodeURIComponent(category.nom)}`)}
              >
                {category.nom}
                {category.produits_count > 0 && (
                  <span className="badge bg-secondary ms-2">{category.produits_count}</span>
                )}
              </button>
            </li>
          ))
        ) : (
          <li>
            <button className='dropdown-item' type='button'>
              Aucune catégorie disponible
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MenuCategories;