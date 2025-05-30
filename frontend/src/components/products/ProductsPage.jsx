import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductsPage.css';

const ProductsPage = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/produits');
                setProduits(response.data);
                console.log('Produits:', response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des produits');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading">Chargement des produits...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-page">
            <h1>Tous nos produits</h1>
            <div className="products-grid">
                {produits.map((produit) => (
                    <div key={produit.id} className="product-card">
                        {produit.images && produit.images.length > 0 && (
                            <img 
                                src={produit.images[0].url} 
                                alt={produit.nom} 
                                className="product-image"
                            />
                        )}
                        <div className="product-info">
                            <h3>{produit.nom}</h3>
                            <p className="price">{produit.prix} frcfa</p>
                            <p className="vendor">Vendeur: {produit.vendeur?.nom_boutique}</p>
                            <Link to={`/products/${produit.id}`} className="view-button">
                                Voir le produit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage; 


