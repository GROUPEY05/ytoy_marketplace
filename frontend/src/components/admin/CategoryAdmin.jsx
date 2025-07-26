import React, { useState, useEffect } from 'react'

import { adminService } from '../../services/api'
import { Table, Button, Form, Modal } from 'react-bootstrap'
import AdminSidebar from './AdminSidebar'

const CategorieAdmin = () => {
  const [categories, setCategories] = useState([])
  const [newCategorie, setNewCategorie] = useState('')
  const [editCategorie, setEditCategorie] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [token, setToken] = useState('')

  // Récupérer le token
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken);
      fetchCategories(storedToken);
    } else {
      console.error('Token manquant');
    }
  }, []);
  
  const fetchCategories = async (token) => {
    if (!token) {
      console.error('Token manquant pour fetchCategories');
      return;
    }
    try {
      const response = await adminService.getCategories(token); // passez le token si besoin
      console.log('Catégories récupérées:', response.data);
  
      setCategories(response.data);  // ici c'est un tableau tel que renvoyé par le backend
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      alert('Erreur lors de la récupération des catégories');
    }
  }

  // Fonction utilitaire pour nettoyer les données
  const cleanData = data => {
    return {
      nom: data.nom?.trim(),
      description: data.description?.trim()
      // Ajoutez d'autres champs nécessaires ici
    }
  }

  const handleCreate = async () => {
    if (!newCategorie.trim()) {
      alert('Veuillez entrer un nom de catégorie')
      return
    }

    try {
      await adminService.createCategory({
        nom: newCategorie,
        description: '' // Ajoutez une description si nécessaire
      })
      setNewCategorie('')
      fetchCategories()
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      alert('Erreur lors de la création de la catégorie')
    }
  }

  const handleUpdate = async () => {
    if (!editCategorie) return

    try {
      await adminService.updateCategory(editCategorie.id, {
        nom: editCategorie.nom,
        description: editCategorie.description
      })
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error)
      alert('Erreur lors de la mise à jour de la catégorie')
    }
  }

  const handleDelete = async id => {
    if (!token) {
      console.error('Token is missing!')
      return
    }

    try {
      await adminService.deleteCategory(id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchCategories()
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error)
      alert('Erreur lors de la suppression de la catégorie')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, []) // Supprimez la dépendance au token

  return (
    <div className='container-fluid4 '>
      <div className='row'>
        {/* Sidebar */}
        <AdminSidebar/>
        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='p-4'>
          <h2>Gestion des catégories</h2>

          <Form className='d-flex gap-2 my-3'>
            <Form.Control
              type='text'
              value={newCategorie}
              onChange={e => setNewCategorie(e.target.value)}
              placeholder='Nouvelle catégorie'
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
                categories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    {/* CORRECTION: Utiliser 'nom' au lieu de 'name' */}
                    <td>{cat.nom}</td>
                    <td>
                      <Button
                        variant='warning'
                        size='sm'
                        onClick={() => {
                          setEditCategorie(cat)
                          setShowModal(true)
                        }}
                      >
                        Modifier
                      </Button>{' '}
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => handleDelete(cat.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* <td colSpan="3" className="text-center">
                Aucune catégorie disponible
              </td> */}
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
                type='text'
                // CORRECTION: Utiliser 'nom' au lieu de 'name'
                value={editCategorie?.nom || ''}
                onChange={e =>
                  setEditCategorie({ ...editCategorie, nom: e.target.value })
                }
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant='primary' onClick={handleUpdate}>
                Sauvegarder
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        </main>
      </div>
    </div>
  )
}

export default CategorieAdmin
