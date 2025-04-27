import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const CategorieAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newCategorie, setNewCategorie] = useState('');
  const [editCategorie, setEditCategorie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState('');

  // Récupérer le token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Token récupéré:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error('Token is missing!');
    }
  }, []);
  
  const fetchCategories = async () => {
    if (!token) {
      console.error('Token is missing!');
      return;
    }
    
    try {
      const res = await axios.get('http://localhost:8000/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Catégories récupérées:', res.data);
      setCategories(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
      alert('Erreur lors de la récupération des catégories');
    }
  };

  const handleCreate = async () => {
    if (!newCategorie.trim()) return alert('Veuillez entrer un nom de catégorie');
    if (!token) {
      console.error('Token is missing!');
      return;
    }
  
    // CORRECTION: Utiliser 'nom' au lieu de 'name' pour correspondre au backend
    const requestData = { nom: newCategorie };
    console.log('Données envoyées:', requestData);
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/categories',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Réponse complète:', response);
      
      setNewCategorie('');
      fetchCategories();
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message || error);
      console.error('Statut HTTP:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      alert('Erreur lors de l\'ajout de la catégorie');
    }
  };

  const handleUpdate = async () => {
    if (!token) {
      console.error('Token is missing!');
      return;
    }

    try {
      // CORRECTION: Utiliser 'nom' au lieu de 'name'
      await axios.put(
        `http://localhost:8000/api/admin/categories/${editCategorie.id}`,
        { nom: editCategorie.nom },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
      alert('Erreur lors de la mise à jour de la catégorie');
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      console.error('Token is missing!');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/admin/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  return (
    <div className="p-4">
      <h2>Gestion des catégories</h2>

      <Form className="d-flex gap-2 my-3">
        <Form.Control
          type="text"
          value={newCategorie}
          onChange={(e) => setNewCategorie(e.target.value)}
          placeholder="Nouvelle catégorie"
        />
        <Button onClick={handleCreate}>Ajouter</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                {/* CORRECTION: Utiliser 'nom' au lieu de 'name' */}
                <td>{cat.nom}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setEditCategorie(cat);
                      setShowModal(true);
                    }}
                  >
                    Modifier
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Aucune catégorie disponible
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal pour modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            // CORRECTION: Utiliser 'nom' au lieu de 'name'
            value={editCategorie?.nom || ''}
            onChange={(e) =>
              setEditCategorie({ ...editCategorie, nom: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategorieAdmin;