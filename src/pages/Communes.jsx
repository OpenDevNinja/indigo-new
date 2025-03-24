// src/pages/Communes.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
//import { CommuneService } from '../services/communeService';
//import { CountryService } from '../services/countryService';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';
import { MapPin, Loader } from 'lucide-react';
import { CommuneService } from '../services/commune';
import { CountryService } from '../services/country';

/**
 * Page de gestion des communes
 */
const Communes = () => {
  // États pour la gestion des données
  const [communes, setCommunes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    country_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchCommunes();
    fetchCountries();
  }, []);

  // Récupération des communes depuis l'API
  const fetchCommunes = async () => {
    try {
      setLoading(true);
      const data = await CommuneService.getAll();
      setCommunes(data);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des communes');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des pays pour le formulaire
  const fetchCountries = async () => {
    try {
      const data = await CountryService.getAll();
      setCountries(data);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des pays');
      console.error('Erreur de chargement des pays:', error);
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
          <MapPin size={16} className="text-gray-500" />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      header: 'Pays',
      accessor: 'country_name',
      sortable: true,
      cell: (row) => row.country ? row.country.name : 'Non défini'
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
    setSelectedCommune(null);
    setFormValues({ name: '', country_id: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (commune) => {
    setSelectedCommune(commune);
    setFormValues({
      name: commune.name,
      country_id: commune.country_id
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const commune = communes.find(c => c.id === id);
    setSelectedCommune(commune);
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
      errors.name = "Le nom de la commune est requis";
    }
    
    if (!formValues.country_id) {
      errors.country_id = "Le pays est requis";
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
      if (selectedCommune) {
        // Mise à jour d'une commune existante
        await CommuneService.update(selectedCommune.id, formValues);
        toast.success(`Commune "${formValues.name}" mise à jour avec succès`);
      } else {
        // Création d'une nouvelle commune
        await CommuneService.create(formValues);
        toast.success(`Commune "${formValues.name}" ajoutée avec succès`);
      }
      
      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchCommunes();
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

  // Suppression d'une commune
  const handleDeleteConfirm = async () => {
    if (!selectedCommune) return;
    
    try {
      await CommuneService.delete(selectedCommune.id);
      toast.success(`Commune "${selectedCommune.name}" supprimée avec succès`);
      setIsDeleteModalOpen(false);
      fetchCommunes();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Communes</h1>
      
      <DataTable 
        data={communes}
        columns={columns}
        title="Liste des communes"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="communes-export"
      />
      
      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCommune ? `Modifier la commune: ${selectedCommune.name}` : "Ajouter une nouvelle commune"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom de la commune
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
              placeholder="Nom de la commune"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="country_id" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Pays
            </label>
            <select
              id="country_id"
              name="country_id"
              value={formValues.country_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${
                formErrors.country_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un pays</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
            {formErrors.country_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.country_id}</p>
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
                selectedCommune ? "Mettre à jour" : "Ajouter"
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
        itemName={selectedCommune ? `la commune "${selectedCommune.name}"` : ""}
      />
    </div>
  );
};

export default Communes;