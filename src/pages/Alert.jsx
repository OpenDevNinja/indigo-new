// src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { AlertService } from '../services/alert';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';
import { Bell, Loader, PhoneCall, Mail } from 'lucide-react';

/**
 * Page de gestion des alertes
 */
const Alerts = () => {
  // États pour la gestion des données
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ 
    email: '',
    indication: '',
    phone: '' 
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Récupération des alertes depuis l'API
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await AlertService.getAll();
      const data = response.results || response.data || response || [];
      
      setAlerts(data);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des alertes');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Colonnes pour le tableau
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      excludeFromExport: true
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-500" />
          <span>{row.email}</span>
        </div>
      )
    },
    {
      header: 'Indicatif',
      accessor: 'indication',
      sortable: true
    },
    {
      header: 'Téléphone',
      accessor: 'phone',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <PhoneCall size={16} className="text-gray-500" />
          <span>{row.phone}</span>
        </div>
      )
    },
    {
      header: 'Date de création',
      accessor: 'created_at',
      sortable: true,
      cell: (row) => new Date(row.created_at).toLocaleDateString('fr-FR')
    }
  ];

  // Gestion de l'ouverture du formulaire d'ajout
  const handleAddClick = () => {
    setSelectedAlert(null);
    setFormValues({ 
      email: '',
      indication: '+229',
      phone: '' 
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (alert) => {
    setSelectedAlert(alert);
    setFormValues({ 
      email: alert.email,
      indication: alert.indication,
      phone: alert.phone 
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const alert = alerts.find(a => a.id === id);
    setSelectedAlert(alert);
    setIsDeleteModalOpen(true);
  };

  // Gestion du changement des valeurs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur de ce champ si elle existe
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "L'email n'est pas valide";
    }
    
    if (!formValues.indication.trim()) {
      errors.indication = "L'indicatif téléphonique est requis";
    }
    
    if (!formValues.phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      if (selectedAlert) {
        // Mise à jour d'une alerte existante
        await AlertService.update(selectedAlert.id, formValues);
        toast.success(`Alerte mise à jour avec succès`);
      } else {
        // Création d'une nouvelle alerte
        await AlertService.create(formValues);
        toast.success(`Alerte ajoutée avec succès`);
      }
      
      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchAlerts();
    } catch (error) {
      // Gestion des erreurs de validation
      if (error.validationErrors) {
        setFormErrors(error.validationErrors);
      } else {
        toast.error(error.message || "Une erreur est survenue lors de l'enregistrement");
      }
      console.error('Erreur formulaire:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Suppression d'une alerte
  const handleDeleteConfirm = async () => {
    if (!selectedAlert) return;
    
    try {
      await AlertService.delete(selectedAlert.id);
      toast.success(`Alerte supprimée avec succès`);
      setIsDeleteModalOpen(false);
      fetchAlerts();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Alertes</h1>
      
      <DataTable 
        data={alerts}
        columns={columns}
        title="Liste des alertes"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="alertes-export"
      />
      
      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAlert ? `Modifier l'alerte` : "Ajouter une nouvelle alerte"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                  formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="exemple@email.com"
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="indication" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Indicatif téléphonique
              </label>
              <input
                type="text"
                id="indication"
                name="indication"
                value={formValues.indication}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                  formErrors.indication ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="229"
              />
              {formErrors.indication && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.indication}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Numéro de téléphone
              </label>
              <div className="relative">
                <PhoneCall size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                    formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="55187390"
                />
              </div>
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-150 disabled:opacity-70 flex items-center"
            >
              {formSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                selectedAlert ? "Mettre à jour" : "Ajouter"
              )}
            </button>
          </div>
        </form>
      </ModalForm>
      
      {/* Modal de confirmation de suppression */}
      <DeleteAlert
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedAlert ? `cette alerte` : ""}
      />
    </div>
  );
};

export default Alerts;