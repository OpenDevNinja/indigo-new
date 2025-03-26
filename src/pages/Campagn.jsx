import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CampaignService } from '../services/campaign';
import { PanelService } from '../services/panel';
import { CustomerService } from '../services/customer';
import DataTable from '../components/DataTable';
import ModalForm from '../components/FormModal';
import DeleteAlert from '../components/DeleteAlert';
import { Calendar, Users, Loader, PlusCircle, MinusCircle } from 'lucide-react';

/**
 * Page de gestion des campagnes publicitaires
 */
const Campaigns = () => {
  // États pour la gestion des données
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // États pour les données de référence
  const [panels, setPanels] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // États du formulaire
  const [formValues, setFormValues] = useState({
    customer_id: '',
    start_date: '',
    end_date: '',
    panel_data_for_campaign: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement initial des données
  useEffect(() => {
    fetchCampaigns();
    fetchReferenceData();
  }, []);

  // Récupération des campagnes depuis l'API
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await CampaignService.getAll();
      
      console.log('Données campagnes reçues:', data);
      
      // Transformation en tableau
      const campaignsArray = Array.isArray(data) ? data : (data.results || data.data || []);
      
      setCampaigns(campaignsArray);
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement des campagnes');
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des données de référence
  const fetchReferenceData = async () => {
    try {
      const [panelsData, customersData] = await Promise.all([
        PanelService.getAll().catch(() => []),
        CustomerService.getAll().catch(() => [])
      ]);
      
      console.log('Données référence:', { panelsData, customersData });
      
      // Transformation en tableaux
      setPanels(Array.isArray(panelsData) ? panelsData : (panelsData.results || panelsData.data || []));
      setCustomers(Array.isArray(customersData) ? customersData : (customersData.results || customersData.data || []));
    } catch (error) {
      toast.error('Erreur lors du chargement des données de référence');
      console.error('Erreur de chargement des références:', error);
    }
  };

  // Filtrage des panneaux
  const filteredPanels = searchTerm 
    ? panels.filter(panel => 
        panel.surface.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (panel.city?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (panel.commune?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : panels;

  // Colonnes pour le tableau
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      excludeFromExport: true
    },
    {
      header: 'Client',
      accessor: 'customer_name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span>{row.customer_name}</span>
        </div>
      )
    },
    {
      header: 'Date de début',
      accessor: 'start_date',
      sortable: true,
      cell: (row) => new Date(row.start_date).toLocaleDateString('fr-FR')
    },
    {
      header: 'Date de fin',
      accessor: 'end_date',
      sortable: true,
      cell: (row) => new Date(row.end_date).toLocaleDateString('fr-FR')
    },
    {
      header: 'Panneaux',
      accessor: 'panel_count',
      sortable: true,
      cell: (row) => row.panel_data_for_campaign?.length || 0
    }
  ];

  // Gestion de l'ouverture du formulaire d'ajout
  const handleAddClick = () => {
    setSelectedCampaign(null);
    setFormValues({
      customer_id: '',
      start_date: '',
      end_date: '',
      panel_data_for_campaign: []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture du formulaire d'édition
  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    
    // Formatage des dates pour l'input
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormValues({
      customer_id: campaign.customer_id || '',
      start_date: formatDate(campaign.start_date),
      end_date: formatDate(campaign.end_date),
      panel_data_for_campaign: campaign.panel_data_for_campaign || []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Gestion de l'ouverture de l'alerte de suppression
  const handleDeleteClick = (id) => {
    const campaign = campaigns.find(c => c.id === id);
    setSelectedCampaign(campaign);
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

  // Ajout d'un panneau à la campagne
  const handleAddPanel = (panel) => {
    const existingPanel = formValues.panel_data_for_campaign.find(p => p.id === panel.id);
    
    if (existingPanel) {
      // Si le panneau existe déjà, augmenter la quantité
      setFormValues(prev => ({
        ...prev,
        panel_data_for_campaign: prev.panel_data_for_campaign.map(p =>
          p.id === panel.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }));
    } else {
      // Ajouter un nouveau panneau avec quantité 1
      setFormValues(prev => ({
        ...prev,
        panel_data_for_campaign: [
          ...prev.panel_data_for_campaign,
          { id: panel.id, quantity: 1, panel_data: panel }
        ]
      }));
    }
  };

  // Retirer un panneau de la campagne
  const handleRemovePanel = (panelId) => {
    setFormValues(prev => ({
      ...prev,
      panel_data_for_campaign: prev.panel_data_for_campaign.filter(p => p.id !== panelId)
    }));
  };

  // Modification de la quantité d'un panneau
  const handleQuantityChange = (panelId, quantity) => {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    
    setFormValues(prev => ({
      ...prev,
      panel_data_for_campaign: prev.panel_data_for_campaign.map(p =>
        p.id === panelId ? { ...p, quantity: newQuantity } : p
      )
    }));
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.customer_id) {
      errors.customer_id = "Le client est requis";
    }
    
    if (!formValues.start_date) {
      errors.start_date = "La date de début est requise";
    }
    
    if (!formValues.end_date) {
      errors.end_date = "La date de fin est requise";
    } else if (new Date(formValues.end_date) <= new Date(formValues.start_date)) {
      errors.end_date = "La date de fin doit être après la date de début";
    }
    
    if (formValues.panel_data_for_campaign.length === 0) {
      errors.panel_data_for_campaign = "Au moins un panneau doit être sélectionné";
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
      if (selectedCampaign) {
        // Mise à jour d'une campagne existante
        await CampaignService.update(selectedCampaign.id, formValues);
        toast.success("Campagne mise à jour avec succès");
      } else {
        // Création d'une nouvelle campagne
        await CampaignService.create(formValues);
        toast.success("Campagne créée avec succès");
      }
      
      // Fermer la modal et rafraîchir les données
      setIsModalOpen(false);
      fetchCampaigns();
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

  // Suppression d'une campagne
  const handleDeleteConfirm = async () => {
    if (!selectedCampaign) return;
    
    try {
      await CampaignService.delete(selectedCampaign.id);
      toast.success("Campagne supprimée avec succès");
      setIsDeleteModalOpen(false);
      fetchCampaigns();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
      console.error('Erreur de suppression:', error);
    }
  };

  // Obtenir les détails d'un panneau
  const getPanelDetails = (panelId) => {
    return panels.find(panel => panel.id === panelId) || {};
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Campagnes</h1>
      
      <DataTable 
        data={campaigns}
        columns={columns}
        title="Liste des campagnes"
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
        filename="campagnes-export"
      />
      
      {/* Modal pour ajout/modification */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCampaign ? `Modifier la campagne` : "Créer une nouvelle campagne"}
        size="xl" // Modal plus large pour accommoder la sélection de panneaux
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Sélection du client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client
            </label>
            <select
              name="customer_id"
              value={formValues.customer_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                formErrors.customer_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un client</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullname}
                </option>
              ))}
            </select>
            {formErrors.customer_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.customer_id}</p>
            )}
          </div>
          
          {/* Dates de la campagne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de début
              </label>
              <input
                type="date"
                name="start_date"
                value={formValues.start_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  formErrors.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.start_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.start_date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                name="end_date"
                value={formValues.end_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  formErrors.end_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.end_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.end_date}</p>
              )}
            </div>
          </div>
          
          {/* Sélection des panneaux */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Panneaux sélectionnés ({formValues.panel_data_for_campaign.length})
              </label>
              <input
                type="text"
                placeholder="Rechercher un panneau..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Liste des panneaux disponibles */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4 max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Surface</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ville</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Commune</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPanels.length > 0 ? (
                    filteredPanels.map(panel => (
                      <tr key={panel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {panel.surface}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {panel.city_name || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {panel.commune_name || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                          <button
                            type="button"
                            onClick={() => handleAddPanel(panel)}
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <PlusCircle size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Aucun panneau trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Panneaux sélectionnés */}
            {formValues.panel_data_for_campaign.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Surface</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ville</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantité</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formValues.panel_data_for_campaign.map(panelData => {
                      const panel = getPanelDetails(panelData.id);
                      return (
                        <tr key={panelData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {panel.surface || 'N/A'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {panel.city_name || 'N/A'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                            <input
                              type="number"
                              min="1"
                              value={panelData.quantity}
                              onChange={(e) => handleQuantityChange(panelData.id, e.target.value)}
                              className="w-16 text-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePanel(panelData.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <MinusCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                Aucun panneau sélectionné
              </div>
            )}
            
            {formErrors.panel_data_for_campaign && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.panel_data_for_campaign}</p>
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
                selectedCampaign ? "Mettre à jour" : "Créer"
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
        itemName={selectedCampaign ? "cette campagne" : ""}
      />
    </div>
  );
};

export default Campaigns;