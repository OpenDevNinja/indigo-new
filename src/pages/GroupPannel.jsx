// src/pages/PanelGroups.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FolderOpen, Loader } from 'lucide-react';
import { PanelGroupService } from '../services/panelGroup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';

/**
 * Page de gestion des groupes de panneaux
 */
const PanelGroups = () => {
  // États pour la gestion des données
  const [panelGroups, setPanelGroups] = useState([]);
  const [selectedPanelGroup, setSelectedPanelGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchPanelGroups();
  }, []);

  // Récupération des groupes de panneaux depuis l'API
  const fetchPanelGroups = async () => {
    try {
        setLoading(true);
        const response = await PanelGroupService.getAll();
        const data = response.results || response.data || response || [];
       
        setPanelGroups(data);
    } catch (error) {
        toast.error(error.message || 'Erreur lors du chargement des groupes de panneaux');
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
      header: 'Nom',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-gray-500" />
          <span>{row.name}</span>
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
    setSelectedPanelGroup(null);
    setFormValues({ name: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (panelGroup) => {
    setSelectedPanelGroup(panelGroup);
    setFormValues({ name: panelGroup.name });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const panelGroup = panelGroups.find(pg => pg.id === id);
    setSelectedPanelGroup(panelGroup);
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
    
    if (!formValues.name.trim()) {
      errors.name = "Le nom du groupe est requis";
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
      if (selectedPanelGroup) {
        // Mise à jour d'un groupe existant
        await PanelGroupService.update(selectedPanelGroup.id, formValues);
        toast.success(`Groupe "${formValues.name}" mis à jour avec succès`);
      } else {
        // Création d'un nouveau groupe
        await PanelGroupService.create(formValues);
        toast.success(`Groupe "${formValues.name}" ajouté avec succès`);
      }
      
      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchPanelGroups();
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

  // Suppression d'un groupe
  const handleDeleteConfirm = async () => {
    if (!selectedPanelGroup) return;
    
    try {
      await PanelGroupService.delete(selectedPanelGroup.id);
      toast.success(`Groupe "${selectedPanelGroup.name}" supprimé avec succès`);
      setIsDeleteModalOpen(false);
      fetchPanelGroups();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Groupes de Panneaux</h1>
      
      <DataTable
        data={panelGroups}
        columns={columns}
        title="Groupes de panneaux"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="groupes-panneaux-export"
    />
      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPanelGroup ? `Modifier le groupe: ${selectedPanelGroup.name}` : "Ajouter un nouveau groupe"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom du groupe
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom du groupe"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
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
                selectedPanelGroup ? "Mettre à jour" : "Ajouter"
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
        itemName={selectedPanelGroup ? `le groupe "${selectedPanelGroup.name}"` : ""}
      />
    </div>
  );
};

export default PanelGroups;