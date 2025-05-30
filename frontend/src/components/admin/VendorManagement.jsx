import React, { useState, useEffect } from 'react';

import {  adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const VendorManagement = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getPendingVendors();
      
      // Vérifiez que les données sont bien formatées
      if (response.data && Array.isArray(response.data)) {
        setPendingVendors(response.data);
      } else {
        throw new Error('Format de données incorrect');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des vendeurs:', error);
      setError('Impossible de charger les vendeurs. Veuillez réessayer plus tard.');
      toast.error('Erreur lors du chargement des vendeurs');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorApproval = async (vendorId, approved) => {
    try {
      if (approved) {
        await adminService.approveVendor(vendorId);
      } else {
        await adminService.rejectVendor(vendorId);
      }
      toast.success(approved ? 'Vendeur approuvé avec succès' : 'Vendeur désactivé avec succès');
      fetchPendingVendors();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <>
    <Header />
    <div className="container mt-4">
      <h2>Gestion des Vendeurs</h2>

      {pendingVendors.length === 0 ? (
        <div className="alert alert-info">Aucun vendeur en attente de vérification.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Boutique</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.id}</td>
                  <td>{vendor.nom} {vendor.prenom}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.vendeur?.nom_boutique || 'Non spécifié'}</td>
                  <td>
                    <span className={`badge ${vendor.vendeur?.verifie ? 'bg-success' : 'bg-warning'}`}>
                      {vendor.vendeur?.verifie ? 'Vérifié' : 'En attente'}
                    </span>
                  </td>
                  <td>
                    {vendor.vendeur && (
                      <>
                        {!vendor.vendeur.verifie ? (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleVendorApproval(vendor.vendeur.id, true)}
                          >
                            Approuver
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleVendorApproval(vendor.vendeur.id, false)}
                          >
                            Désactiver
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-primary mt-3" onClick={fetchPendingVendors}>
        Rafraîchir
      </button>
    </div>
    <Footer />
    </>
  );
};

export default VendorManagement;