// import React, { useEffect, useState } from 'react';
// import { apiClient } from "../../services/api";
// import { MdMenu } from "react-icons/md";

// const slugify = (text) =>
//   text
//     .toString()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w\-]+/g, '')
//     .replace(/\-\-+/g, '-')
//     .replace(/^-+/, '')
//     .replace(/-+$/, '');

// const MenuCategories = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await apiClient.get('/categories');
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Erreur chargement catégories :", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   return (
//     <div className='dropdown'>
//       <button
//         className='btn btn-white'
//         type='button'
//         data-bs-toggle='dropdown'
//         aria-expanded='false'>
//         <MdMenu style={{ fontSize: '30px' }} />
//       </button>
//       <ul className='dropdown-menu'>
//         {categories.map((category) => (
//           <li key={category.id}>
//             <button className='dropdown-item' type='button'>
//               <a
//                 href={`/${slugify(category.name)}`}
//                 style={{ color: '#000000', textDecoration: 'none' }}>
//                 {category.name}
//               </a>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MenuCategories;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdMenu } from 'react-icons/md';

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      // Endpoint actualisé - utilisation du même endpoint que celui utilisé par l'admin
      // mais sans l'authentification
      const response = await axios.get('http://localhost:8000/api/categories');
      
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
      <button
        className='btn btn-white'
        type='button'
        data-bs-toggle='dropdown'
        aria-expanded='false'>
        <MdMenu style={{ fontSize: '30px' }} />
      </button>
      <ul className='dropdown-menu'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id}>
              <button className='dropdown-item' type='button'>
                <a 
                  href={`/${encodeURIComponent(category.nom)}`} 
                  style={{ color: '#000000', textDecoration: 'none' }}
                >
                  {category.nom}
                  {category.produits_count > 0 && (
                  <span className="badge bg-secondary ms-2">{category.produits_count}</span>
                  )}
                </a>
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