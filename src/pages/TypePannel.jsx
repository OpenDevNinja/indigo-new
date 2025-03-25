import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PanelTypeService } from '../services/panelType';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';
import { Loader, LayoutGrid } from 'lucide-react';

const PanelTypes = () => {
  const [panelTypes, setPanelTypes] = useState([]);
  const [selectedPanelType, setSelectedPanelType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ type: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchPanelTypes();
  }, []);

  const fetchPanelTypes = async () => {
    try {
      setLoading(true);
      const response = await PanelTypeService.getAll();
      const data = response.results || response.data || response || [];
      setPanelTypes(data);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des types de panneaux');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      excludeFromExport: true
    },
    {
      header: 'Type',
      accessor: 'type',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-gray-500" />
          <span>{row.type}</span>
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

  const handleAddClick = () => {
    setSelectedPanelType(null);
    setFormValues({ type: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditClick = (panelType) => {
    setSelectedPanelType(panelType);
    setFormValues({ type: panelType.type });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    const panelType = panelTypes.find(c => c.id === id);
    setSelectedPanelType(panelType);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formValues.type.trim()) {
      errors.type = "Le type de panneau est requis";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      if (selectedPanelType) {
        await PanelTypeService.update(selectedPanelType.id, formValues);
        toast.success(`Type de panneau "${formValues.type}" mis à jour avec succès`);
      } else {
        await PanelTypeService.create(formValues);
        toast.success(`Type de panneau "${formValues.type}" ajouté avec succès`);
      }
      
      setIsModalOpen(false);
      fetchPanelTypes();
    } catch (error) {
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

  const handleDeleteConfirm = async () => {
    if (!selectedPanelType) return;
    
    try {
      await PanelTypeService.delete(selectedPanelType.id);
      toast.success(`Type de panneau "${selectedPanelType.type}" supprimé avec succès`);
      setIsDeleteModalOpen(false);
      fetchPanelTypes();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Types de Panneaux</h1>
      
      <DataTable 
        data={panelTypes}
        columns={columns}
        title="Types de panneaux"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="types-panneaux-export"
      />
      
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPanelType ? `Modifier le type: ${selectedPanelType.type}` : "Ajouter un nouveau type de panneau"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="type" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type de panneau
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formValues.type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Type de panneau"
            />
            {formErrors.type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.type}</p>
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
                selectedPanelType ? "Mettre à jour" : "Ajouter"
              )}
            </button>
          </div>
        </form>
      </ModalForm>
      
      <DeleteAlert
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedPanelType ? `le type de panneau "${selectedPanelType.type}"` : ""}
      />
    </div>
  );
};

export default PanelTypes;