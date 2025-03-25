import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { User, Briefcase, MapPin, Phone, Mail, Loader } from 'lucide-react';
import { CustomerService } from '../services/customer';
import { CityService } from '../services/city'; // Service pour récupérer les villes
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';

/**
 * Page de gestion des clients
 */
const Customers = () => {
  // États pour la gestion des données
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    fullname: '',
    email: '',
    indication: '',
    phone: '',
    entreprise_name: '',
    type: 'personal',
    city_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchCustomers();
    fetchCities();
  }, []);

  // Récupération des clients depuis l'API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await CustomerService.getAll();
      const data = response.results || response.data || response || [];

      setCustomers(data);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des clients');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des villes depuis l'API
  const fetchCities = async () => {
    try {
      const response = await CityService.getAll();
      // Gestion de différents formats de réponse possibles
      const data = response.results || response.data || response || [];

      // Vérification et log pour le débogage
      console.log('Données des villes:', data);

      // S'assurer que data est un tableau
      const citiesArray = Array.isArray(data) ? data : [];

      setCities(citiesArray);
    } catch (error) {
      toast.error('Erreur lors du chargement des villes');
      console.error('Erreur de chargement des villes:', error);
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
      header: 'Nom Complet',
      accessor: 'fullname',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span>{row.fullname}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      sortable: true,
      cell: (row) => (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.type === 'entreprise'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
          {row.type === 'entreprise' ? 'Entreprise' : 'Particulier'}
        </div>
      )
    },
    {
      header: 'Entreprise',
      accessor: 'entreprise_name',
      sortable: true,
      cell: (row) => {
        if (!row.entreprise_name) return '-';
        return (
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-gray-500" />
            <span>{row.entreprise_name}</span>
          </div>
        );
      }
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
      header: 'Téléphone',
      accessor: 'phone',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-500" />
          <span>{row.phone}</span>
        </div>
      )
    },
    {
      header: 'Ville',
      accessor: 'city',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span>{row.city ? row.city.name : '-'}</span>
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
    setSelectedCustomer(null);
    setFormValues({
      fullname: '',
      email: '',
      indication: '',
      phone: '',
      entreprise_name: '',
      type: 'personal',
      city_id: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormValues({
      fullname: customer.fullname,
      email: customer.email,
      indication: customer.indication || '',
      phone: customer.phone,
      entreprise_name: customer.entreprise_name || '',
      type: customer.type,
      city_id: customer.city_id
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const customer = customers.find(c => c.id === id);
    setSelectedCustomer(customer);
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

    if (!formValues.fullname.trim()) {
      errors.fullname = "Le nom complet est requis";
    }

    if (!formValues.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Format d'email invalide";
    }

    if (!formValues.phone.trim()) {
      errors.phone = "Le téléphone est requis";
    }

    if (formValues.type === 'entreprise' && !formValues.entreprise_name.trim()) {
      errors.entreprise_name = "Le nom de l'entreprise est requis";
    }

    if (!formValues.city_id) {
      errors.city_id = "La ville est requise";
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
      if (selectedCustomer) {
        // Mise à jour d'un client existant
        await CustomerService.update(selectedCustomer.id, formValues);
        toast.success(`Client "${formValues.fullname}" mis à jour avec succès`);
      } else {
        // Création d'un nouveau client
        await CustomerService.create(formValues);
        toast.success(`Client "${formValues.fullname}" ajouté avec succès`);
      }

      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchCustomers();
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

  // Suppression d'un client
  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    try {
      await CustomerService.delete(selectedCustomer.id);
      toast.success(`Client "${selectedCustomer.fullname}" supprimé avec succès`);
      setIsDeleteModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Clients</h1>

      <DataTable
        data={customers}
        columns={columns}
        title="Liste des clients"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="clients-export"
      />

      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? `Modifier le client: ${selectedCustomer.fullname}` : "Ajouter un nouveau client"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type de client */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de client
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="personal"
                    checked={formValues.type === 'personal'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Particulier</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="entreprise"
                    checked={formValues.type === 'entreprise'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Entreprise</span>
                </label>
              </div>
            </div>

            {/* Nom complet */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formValues.fullname}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${formErrors.fullname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                placeholder="Nom complet"
              />
              {formErrors.fullname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.fullname}</p>
              )}
            </div>

            {/* Nom de l'entreprise (conditionnel) */}
            {formValues.type === 'entreprise' && (
              <div>
                <label htmlFor="entreprise_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  id="entreprise_name"
                  name="entreprise_name"
                  value={formValues.entreprise_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${formErrors.entreprise_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nom de l'entreprise"
                />
                {formErrors.entreprise_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.entreprise_name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                placeholder="Email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone *
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                placeholder="Téléphone"
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
              )}
            </div>

            {/* Indication */}
            <div>
              <label htmlFor="indication" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indication
              </label>
              <input
                type="text"
                id="indication"
                name="indication"
                value={formValues.indication}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
                placeholder="Indication"
              />
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ville *
              </label>
              <select
                id="city_id"
                name="city_id"
                value={formValues.city_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ${formErrors.city_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              {formErrors.city_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.city_id}</p>
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
                selectedCustomer ? "Mettre à jour" : "Ajouter"
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
        itemName={selectedCustomer ? `le client "${selectedCustomer.fullname}"` : ""}
      />
    </div>
  );
};

export default Customers;