
// src/components/admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Container, Row, Col, Badge, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { adminService } from '../../services/api';  // Importez adminService
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await adminService.getUsers(currentPage, selectedRole, searchTerm);

      if (response.data && response.data.success) {
        setUsers(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      } else {
        setUsers([]);
        setTotalPages(1);
        setError('Aucun utilisateur trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Impossible de charger la liste des utilisateurs.');
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleRoleFilter = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const handleBanUser = async (userId, currentStatus) => {
    try {
      const response = await adminService.banUser(userId);

      if (response.data && response.data.success) {
        // Mettre à jour l'état local avec la nouvelle valeur de actif
        setUsers(users.map(user =>
          user.id === userId ? { ...user, actif: response.data.data.actif } : user
        ));

        alert(response.data.message);
      } else {
        throw new Error('La réponse du serveur est invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      alert('Une erreur est survenue lors de la modification du statut de l\'utilisateur.');
    }
  };

  const renderStatusBadge = (actif) => {
    if (actif) {
      return <Badge bg="success">Actif</Badge>;
    } else {
      return <Badge bg="danger">Banni</Badge>;
    }
  };

  const renderRoleBadge = (role) => {
    switch (role) {
      case 'administrateur':
        return <Badge bg="danger">Admin</Badge>;
      case 'vendeur':
        return <Badge bg="primary">Vendeur</Badge>;
      case 'acheteur':
        return <Badge bg="success">Acheteur</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };
  return (
    <>
      <div className='container-fluid4 '>
        <div className='row'>
          {/* Sidebar */}
          <AdminSidebar />
          <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            <Container className="py-4">
              <Card>
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Gestion des utilisateurs</h2>
                    <Link to="/admin/dashboard" className="btn btn-light">
                      Retour au tableau de bord
                    </Link>
                  </div>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form onSubmit={handleSearch}>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Button variant="outline-primary" type="submit">
                            <i className="bi bi-search"></i>
                          </Button>
                        </InputGroup>
                      </Form>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        value={selectedRole}
                        onChange={handleRoleFilter}
                        className="w-auto float-md-end"
                      >
                        <option value="all">Tous les rôles</option>
                        <option value="acheteur">Acheteurs</option>
                        <option value="vendeur">Vendeurs</option>
                        <option value="administrateur">Administrateurs</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">Chargement des utilisateurs...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table striped hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nom</th>
                              <th>Email</th>
                              <th>Rôle</th>
                              <th>État</th>
                              <th>Date d'inscription</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.length > 0 ? (
                              users.map(user => (
                                <tr key={user.id}>
                                  <td>{user.id}</td>
                                  <td>{user.prenom} {user.nom}</td>
                                  <td>{user.email}</td>
                                  <td>{renderRoleBadge(user.role)}</td>
                                  <td>{renderStatusBadge(user.actif)}</td>
                                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                  <td>
                                    <Button
                                      variant={!user.actif ? 'outline-success' : 'outline-danger'}
                                      size="sm"
                                      onClick={() => handleBanUser(user.id, user.actif)}
                                      className="me-2"
                                    >
                                      {!user.actif ? 'Réactiver' : 'Bannir'}
                                    </Button>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      as={Link}
                                      to={`/admin/users/${user.id}`}
                                    >
                                      Détails
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">Aucun utilisateur trouvé</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                          <Button
                            variant="outline-primary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="me-2"
                          >
                            Précédent
                          </Button>
                          <span className="mx-3 align-self-center">
                            Page {currentPage} sur {totalPages}
                          </span>
                          <Button
                            variant="outline-primary"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Suivant
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Container>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserList;