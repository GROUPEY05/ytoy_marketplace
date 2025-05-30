import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProducts();
      // Vérifiez la structure de la réponse
      console.log('Réponse API:', response);
      
      if (response.data) {
        setProducts(Array.isArray(response.data) ? response.data : response.data.data);
      } else {
        setProducts([]);
        toast.error('Format de données invalide');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response || error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      toast.success('Produit supprimé avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Gestion des Produits</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Vendeur</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.nom}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>{product.nom}</td>
                  <td>{product.prix} FRCFA</td>
                  <td>{product.vendeur?.nom}</td>
                  <td>{product.categorie?.nom}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductManagement;
