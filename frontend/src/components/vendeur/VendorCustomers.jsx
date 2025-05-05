import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Form, InputGroup, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { apiClient } from '../../services/api';

const VendorCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0,
    averageOrderValue: 0
  });

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/vendor/customers?page=${page}&per_page=${perPage}&search=${searchTerm}`);
      
      if (response.data) {
        setCustomers(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        
        // Mettre à jour les statistiques
        if (response.data.stats) {
          setStats({
            totalCustomers: response.data.stats.total_customers || 0,
            newCustomers: response.data.stats.new_customers || 0,
            returningCustomers: response.data.stats.returning_customers || 0,
            averageOrderValue: response.data.stats.average_order_value || 0
          });
        }
      }
      
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des clients', err);
      setError('Impossible de charger vos clients. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(1);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des Clients</h2>
      </div>
      
      {/* Statistiques des clients */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Clients
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCustomers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-people fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Nouveaux Clients (30j)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.newCustomers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-person-plus fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Clients Fidèles
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.returningCustomers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-person-check fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Panier Moyen
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {(stats.averageOrderValue || 0).toFixed(2)} €
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-cart-check fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Liste des Clients</h6>
          <Form onSubmit={handleSearch} className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                variant="primary" 
                type="submit"
                style={{ backgroundColor: '#FF6F00', borderColor: '#FF6F00' }}
              >
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Card.Header>
        <Card.Body>
          {loading && customers.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Chargement des clients...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Commandes</th>
                    <th>Montant Total</th>
                    <th>Inscrit le</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>#{customer.id}</td>
                        <td>{customer.nom} {customer.prenom}</td>
                        <td>{customer.email}</td>
                        <td>{customer.telephone || 'N/A'}</td>
                        <td>{customer.total_orders || 0}</td>
                        <td>{(customer.total_spent || 0).toFixed(2)} €</td>
                        <td>{formatDate(customer.created_at)}</td>
                        <td>
                          {customer.total_orders > 3 ? (
                            <Badge bg="success">Fidèle</Badge>
                          ) : customer.total_orders > 0 ? (
                            <Badge bg="info">Actif</Badge>
                          ) : (
                            <Badge bg="secondary">Nouveau</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        {searchTerm ? 'Aucun client trouvé pour cette recherche' : 'Aucun client trouvé'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchCustomers(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => fetchCustomers(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchCustomers(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VendorCustomers;
