import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Simulez des données de produits (à remplacer par de vraies données d'API)
const dummyProducts = [
  { id: 1, name: 'Produit 1', price: 19.99, image: '/api/placeholder/300/200', description: 'Description du produit 1' },
  { id: 2, name: 'Produit 2', price: 29.99, image: '/api/placeholder/300/200', description: 'Description du produit 2' },
  { id: 3, name: 'Produit 3', price: 39.99, image: '/api/placeholder/300/200', description: 'Description du produit 3' },
  { id: 4, name: 'Produit 4', price: 49.99, image: '/api/placeholder/300/200', description: 'Description du produit 4' },
  { id: 5, name: 'Produit 5', price: 59.99, image: '/api/placeholder/300/200', description: 'Description du produit 5' },
  { id: 6, name: 'Produit 6', price: 69.99, image: '/api/placeholder/300/200', description: 'Description du produit 6' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  useEffect(() => {
    // Simulez un chargement d'API
    const fetchProducts = async () => {
      try {
        // Remplacez cette partie par un appel API réel
        setTimeout(() => {
          setProducts(dummyProducts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Nos Produits</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
        
        <Col md={6} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
          <Form.Select 
            className="w-auto" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Trier par nom</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </Form.Select>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : sortedProducts.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {sortedProducts.map(product => (
            <Col key={product.id}>
              <Card className="h-100">
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted mb-0">{product.price.toFixed(2)} €</Card.Text>
                  <Card.Text className="small text-truncate mb-3">{product.description}</Card.Text>
                  <div className="mt-auto d-flex gap-2">
                    <Button 
                      as={Link} 
                      to={`/products/${product.id}`} 
                      variant="outline-primary" 
                      className="flex-grow-1"
                    >
                      Détails
                    </Button>
                    <Button variant="primary">
                      <i className="bi bi-cart-plus"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p>Aucun produit trouvé pour votre recherche.</p>
        </div>
      )}
    </Container>
  );
};

export default Products;