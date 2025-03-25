// src/pages/Cities.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';

import { MapPin, Building, Globe, Loader } from 'lucide-react';
import { CityService } from '../services/city';
import { CommuneService } from '../services/commune';
import { CountryService } from '../services/country';

/**
 * Page de gestion des villes
 */
const Cities = () => {
  // États pour la gestion des données
  const [cities, setCities] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', commune_id: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  // Récupération des villes depuis l'API
  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await CityService.getAll();
      
      // Log pour diagnostiquer la structure des données
      console.log('Données des villes reçues:', response);
      
      // Transformation robuste en tableau
      const citiesArray = response.results || response.data || response || [];
      const finalCities = Array.isArray(citiesArray) ? citiesArray : [];
      
      setCities(finalCities);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des villes');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des pays depuis l'API
  const fetchCountries = async () => {
    try {
      const response = await CountryService.getAll();
      const countriesArray = response.results || response.data || response || [];
      setCountries(Array.isArray(countriesArray) ? countriesArray : []);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des pays');
      console.error('Erreur de chargement:', error);
    }
  };
  
  const fetchCommunesByCountry = async (countryId) => {
    if (!countryId) {
      setCommunes([]);
      return;
    }
  
    try {
      const response = await CommuneService.getByCountry(countryId);
      const communesArray = response.results || response.data || response || [];
      const finalCommunes = Array.isArray(communesArray) ? communesArray : [];
      
      setCommunes(finalCommunes);
      
      // Réinitialiser la commune sélectionnée si elle n'appartient plus au pays sélectionné
      if (formValues.commune_id && !finalCommunes.some(c => c.id === formValues.commune_id)) {
        setFormValues(prev => ({ ...prev, commune_id: '' }));
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des communes');
      console.error('Erreur de chargement:', error);
    }
  };
  
  // Effet pour charger les communes lorsqu'un pays est sélectionné
  useEffect(() => {
    if (selectedCountry) {
      fetchCommunesByCountry(selectedCountry);
    }
  }, [selectedCountry]);

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
      header: 'Commune',
      accessor: 'commune_name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building size={16} className="text-gray-500" />
          <span>{row.commune_name}</span>
        </div>
      )
    },
    {
      header: 'Pays',
      accessor: 'country_name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-500" />
          <span>{row.country_name}</span>
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

  // Gestion de l'ouverture du formulaire pour ajout
  const handleAddClick = () => {
    setSelectedCity(null);
    setSelectedCountry('');
    setFormValues({ name: '', commune_id: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire pour modification
  const handleEditClick = (city) => {
    setSelectedCity(city);
    // Trouver le pays de la commune pour pré-remplir le formulaire
    const commune = city.commune || {};
    setSelectedCountry(commune.country_id || '');
    setFormValues({ 
      name: city.name,
      commune_id: city.commune_id || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
    
    if (commune.country_id) {
      fetchCommunesByCountry(commune.country_id);
    }
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const city = cities.find(c => c.id === id);
    setSelectedCity(city);
    setIsDeleteModalOpen(true);
  };

  // Gestion des changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Si le pays change, mettre à jour les communes
    if (name === 'country_id') {
      setSelectedCountry(value);
    }
    
    // Réinitialiser les erreurs lors de la modification
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.name.trim()) {
      errors.name = 'Le nom de la ville est requis';
    }
    
    if (!formValues.commune_id) {
      errors.commune_id = 'La commune est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormSubmitting(true);
    
    try {
      if (selectedCity) {
        // Mise à jour
        await CityService.update(selectedCity.id, formValues);
        toast.success('Ville mise à jour avec succès !');
      } else {
        // Création
        await CityService.create(formValues);
        toast.success('Ville créée avec succès !');
      }
      
      setIsModalOpen(false);
      fetchCities(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      
      if (error.validationErrors) {
        setFormErrors(error.validationErrors);
      } else {
        toast.error(error.message || 'Une erreur est survenue');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Suppression d'une ville
  const handleConfirmDelete = async () => {
    if (!selectedCity) return;
    
    try {
      await CityService.delete(selectedCity.id);
      toast.success('Ville supprimée avec succès !');
      setIsDeleteModalOpen(false);
      fetchCities(); // Rafraîchir la liste
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Gestion des Villes
      </h1>
      
      <DataTable
        data={cities}
        columns={columns}
        title="Liste des villes"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="villes"
      />
      
      {/* Modal pour ajouter/modifier une ville */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCity ? 'Modifier une ville' : 'Ajouter une ville'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection du pays */}
          <div>
            <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pays
            </label>
            <select
              id="country_id"
              name="country_id"
              value={selectedCountry}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value="">Sélectionnez un pays</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            {formErrors.country_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.country_id}</p>
            )}
          </div>
          
          {/* Sélection de la commune */}
          <div>
            <label htmlFor="commune_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commune
            </label>
            <select
              id="commune_id"
              name="commune_id"
              value={formValues.commune_id}
              onChange={handleFormChange}
              disabled={!selectedCountry || communes.length === 0}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 disabled:opacity-60"
            >
              <option value="">Sélectionnez une commune</option>
              {communes.map(commune => (
                <option key={commune.id} value={commune.id}>
                  {commune.name}
                </option>
              ))}
            </select>
            {formErrors.commune_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.commune_id}</p>
            )}
            {selectedCountry && communes.length === 0 && (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                Aucune commune disponible pour ce pays. Veuillez en créer une d'abord.
              </p>
            )}
          </div>
          
          {/* Champ du nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom de la ville
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder="Entrez le nom de la ville"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
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
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-150 disabled:opacity-70 flex items-center justify-center"
            >
              {formSubmitting ? (
                <Loader size={18} className="animate-spin" />
              ) : selectedCity ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </ModalForm>
      
      {/* Alerte de confirmation de suppression */}
      <DeleteAlert
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCity ? `la ville "${selectedCity.name}"` : 'cette ville'}
      />
    </div>
  );
};

export default Cities;