import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from './AdminSidebar'

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllVendors(); // Charge tous les vendeurs au montage
  }, []);

  const fetchAllVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllVendors();

      if (response.data && response.data.success) {
        setVendors(response.data.data);
      } else {
        throw new Error('Format de données incorrect ou réponse sans succès');
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
      fetchAllVendors();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <>
      <div className='container-fluid4 '>
        <div className='row'>
          {/* Sidebar */}
          <AdminSidebar />
          <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            <div className="container mt-4">
              <h2>Gestion des Vendeurs</h2>

              {vendors.length === 0 ? (
                <div className="alert alert-info">Aucun vendeur trouvé sur la plateforme.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom complet</th>
                        <th>Email</th>
                        <th>Boutique</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((vendor) => (
                        <tr key={vendor.id}>
                          <td>{vendor.utilisateur?.id || vendor.id}</td>
                          <td>{vendor.utilisateur?.nom} {vendor.utilisateur?.prenom}</td>
                          <td>{vendor.utilisateur?.email}</td>
                          <td>{vendor.nom_boutique || 'Non spécifié'}</td>
                          <td>
                            <span className={`badge ${vendor.verifie ? 'bg-success' : 'bg-warning'}`}>
                              {vendor.verifie ? 'Vérifié' : 'En attente'}
                            </span>
                          </td>
                          <td>
                            {!vendor.verifie ? (
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleVendorApproval(vendor.id, true)}
                              >
                                Approuver
                              </button>
                            ) : (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleVendorApproval(vendor.id, false)}
                              >
                                Désactiver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}


            </div>
          </main>
        </div>

      </div>
    </>
  );
};

export default VendorManagement;
