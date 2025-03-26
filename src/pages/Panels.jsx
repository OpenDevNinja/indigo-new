import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Map, Loader } from 'lucide-react';
import { PanelService } from '../services/panel';
import { PanelTypeService } from '../services/panelType';
import { PanelGroupService } from '../services/panelGroup';
import { CommuneService } from '../services/commune';
import { CityService } from '../services/city';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';

/**
 * Page de gestion des panneaux publicitaires
 */
const Panels = () => {
  // États pour la gestion des données
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // États pour les données de référence
  const [panelTypes, setPanelTypes] = useState([]);
  const [panelGroups, setPanelGroups] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [cities, setCities] = useState([]);
  
  // États du formulaire
  const [formValues, setFormValues] = useState({
    type_pannel_id: '',
    group_pannel_id: '',
    commune_id: '',
    surface: '',
    city_id: '',
    quantity: '',
    face_number: 1,
    sense: 'portrait'
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchPanels();
    fetchReferenceData();
  }, []);

  // Récupération des panneaux depuis l'API
  const fetchPanels = async () => {
    try {
      setLoading(true);
      const data = await PanelService.getAll();
      
      console.log('Données panneaux reçues:', data);
      
      // Si data n'est pas un tableau, faites un log détaillé
      if (!Array.isArray(data)) {
        console.log('Type de données:', typeof data);
        console.log('Propriétés de data:', Object.keys(data));
      }
      
      // Transformation en tableau
      const panelsArray = Array.isArray(data) ? data : (data.results || data.data || []);
      
      setPanels(panelsArray);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des panneaux');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des données de référence
  const fetchReferenceData = async () => {
    try {
      const [typesData, groupsData, communesData, citiesData] = await Promise.all([
        PanelTypeService.getAll().catch(() => []),
        PanelGroupService.getAll().catch(() => []),
        CommuneService.getAll().catch(() => []),
        CityService.getAll().catch(() => [])
      ]);
      console.log(typesData, groupsData, communesData, citiesData)
      // Transformation en tableaux
      setPanelTypes(Array.isArray(typesData) ? typesData : (typesData.results || typesData.data || []));
      setPanelGroups(Array.isArray(groupsData) ? groupsData : (groupsData.results || groupsData.data || []));
      setCommunes(Array.isArray(communesData) ? communesData : (communesData.results || communesData.data || []));
      setCities(Array.isArray(citiesData) ? citiesData : (citiesData.results || citiesData.data || []));
    } catch (error) {
      toast.error('Erreur lors du chargement des données de référence');
      console.error('Erreur de chargement des références:', error);
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
      header: 'Type',
      accessor: 'type_pannel_name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Map size={16} className="text-gray-500" />
          <span>{row.type_pannel_name}</span>
        </div>
      )
    },
    {
      header: 'Groupe',
      accessor: 'group_pannel_name',
      sortable: true
    },
    {
      header: 'Commune',
      accessor: 'commune_name',
      sortable: true
    },
    {
      header: 'Ville',
      accessor: 'city_name',
      sortable: true
    },
    {
      header: 'Surface',
      accessor: 'surface',
      sortable: true
    },
    {
      header: 'Quantité',
      accessor: 'quantity',
      sortable: true
    },
    {
      header: 'Faces',
      accessor: 'face_number',
      sortable: true
    },
    {
      header: 'Sens',
      accessor: 'sense',
      sortable: true,
      cell: (row) => (
        <span className={row.sense === 'paysage' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
          {row.sense}
        </span>
      )
    }
  ];

  // Gestion de l'ouverture du formulaire d'ajout
  const handleAddClick = () => {
    setSelectedPanel(null);
    setFormValues({
      type_pannel_id: '',
      group_pannel_id: '',
      commune_id: '',
      surface: '',
      city_id: '',
      quantity: '',
      face_number: 1,
      sense: 'portrait'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (panel) => {
    setSelectedPanel(panel);
    setFormValues({
      type_pannel_id: panel.type_pannel_id || '',
      group_pannel_id: panel.group_pannel_id || '',
      commune_id: panel.commune_id || '',
      surface: panel.surface || '',
      city_id: panel.city_id || '',
      quantity: panel.quantity || '',
      face_number: panel.face_number || 1,
      sense: panel.sense || 'portrait'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const panel = panels.find(p => p.id === id);
    setSelectedPanel(panel);
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

    // Si la commune change, réinitialiser la ville sélectionnée
    if (name === 'commune_id') {
      setFormValues(prev => ({ ...prev, city_id: '' }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.type_pannel_id) {
      errors.type_pannel_id = "Le type de panneau est requis";
    }
    
    if (!formValues.group_pannel_id) {
      errors.group_pannel_id = "Le groupe de panneau est requis";
    }
    
    if (!formValues.commune_id) {
      errors.commune_id = "La commune est requise";
    }
    
    if (!formValues.city_id) {
      errors.city_id = "La ville est requise";
    }
    
    if (!formValues.surface.trim()) {
      errors.surface = "La surface est requise";
    }
    
    if (!formValues.quantity || formValues.quantity <= 0) {
      errors.quantity = "La quantité doit être supérieure à 0";
    }
    
    if (!formValues.face_number || formValues.face_number <= 0) {
      errors.face_number = "Le nombre de faces doit être supérieur à 0";
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
      if (selectedPanel) {
        // Mise à jour d'un panneau existant
        await PanelService.update(selectedPanel.id, formValues);
        toast.success(`Panneau mis à jour avec succès`);
      } else {
        // Création d'un nouveau panneau
        await PanelService.create(formValues);
        toast.success(`Panneau ajouté avec succès`);
      }
      
      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchPanels();
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

  // Suppression d'un panneau
  const handleDeleteConfirm = async () => {
    if (!selectedPanel) return;
    
    try {
      await PanelService.delete(selectedPanel.id);
      toast.success(`Panneau supprimé avec succès`);
      setIsDeleteModalOpen(false);
      fetchPanels();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  // Filtrer les villes en fonction de la commune sélectionnée
  const filteredCities = formValues.commune_id 
    ? cities.filter(city => city.commune_id == formValues.commune_id)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Panneaux</h1>
      
      <DataTable 
        data={panels}
        columns={columns}
        title="Liste des panneaux"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="panneaux-export"
      />
      
      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPanel ? `Modifier le panneau` : "Ajouter un nouveau panneau"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Type de panneau */}
          <div>
            <label 
              htmlFor="type_pannel_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type de panneau
            </label>
            <select
              id="type_pannel_id"
              name="type_pannel_id"
              value={formValues.type_pannel_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.type_pannel_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un type</option>
              {panelTypes.map(type => (
                <option key={type.id} value={type.id}>{type.type}</option>
              ))}
            </select>
            {formErrors.type_pannel_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.type_pannel_id}</p>
            )}
          </div>
          
          {/* Groupe de panneau */}
          <div>
            <label 
              htmlFor="group_pannel_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Groupe de panneau
            </label>
            <select
              id="group_pannel_id"
              name="group_pannel_id"
              value={formValues.group_pannel_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.group_pannel_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un groupe</option>
              {panelGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            {formErrors.group_pannel_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.group_pannel_id}</p>
            )}
          </div>
          
          {/* Commune */}
          <div>
            <label 
              htmlFor="commune_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Commune
            </label>
            <select
              id="commune_id"
              name="commune_id"
              value={formValues.commune_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.commune_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une commune</option>
              {communes.map(commune => (
                <option key={commune.id} value={commune.id}>{commune.name}</option>
              ))}
            </select>
            {formErrors.commune_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.commune_id}</p>
            )}
          </div>
          
          {/* Ville */}
          <div>
            <label 
              htmlFor="city_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ville
            </label>
            <select
              id="city_id"
              name="city_id"
              value={formValues.city_id}
              onChange={handleInputChange}
              //disabled={!formValues.commune_id}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.city_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une ville</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {formErrors.city_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.city_id}</p>
            )}
          </div>
          
          {/* Surface */}
          <div>
            <label 
              htmlFor="surface" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Surface
            </label>
            <input
              type="text"
              id="surface"
              name="surface"
              value={formValues.surface}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.surface ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Surface du panneau"
            />
            {formErrors.surface && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.surface}</p>
            )}
          </div>
          
          {/* Quantité */}
          <div>
            <label 
              htmlFor="quantity" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formValues.quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Quantité disponible"
            />
            {formErrors.quantity && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.quantity}</p>
            )}
          </div>
          
          {/* Nombre de faces */}
          <div>
            <label 
              htmlFor="face_number" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre de faces
            </label>
            <input
              type="number"
              id="face_number"
              name="face_number"
              value={formValues.face_number}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.face_number ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre de faces"
            />
            {formErrors.face_number && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.face_number}</p>
            )}
          </div>
          
          {/* Sens */}
          <div>
            <label 
              htmlFor="sense" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Sens
            </label>
            <select
              id="sense"
              name="sense"
              value={formValues.sense}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
            >
              <option value="portrait">Portrait</option>
              <option value="paysage">Paysage</option>
            </select>
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
                selectedPanel ? "Mettre à jour" : "Ajouter"
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
        itemName={selectedPanel ? `ce panneau` : ""}
      />
    </div>
  );
};

export default Panels;