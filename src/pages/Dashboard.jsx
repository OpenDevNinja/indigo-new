// src/pages/Dashboard.jsx
import React from 'react';
import { 
  BarChart, TrendingUp, CheckCircle, Clock, Layers, Users, Activity,
  ArrowUp, ArrowDown, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Données de votre dashboard
const dashboardData = {
  totalPanels: 254,
  availablePanels: 126,
  occupiedPanels: 128,
  activeCampaigns: 37,
  availableSoonPanels: 22,
  totalClients: 45,
  activeClients: 18
};

// Composant de carte statistique
const StatCard = ({ title, value, icon, color, trend, percent }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-custom transition-shadow duration-300 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span className={`text-sm flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
                {percent}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        
        <div className={`rounded-lg p-2 ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Composant de graphique (simplifié avec une représentation visuelle basique)
const SimpleBarChart = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const values = [65, 80, 72, 90, 85, 95];
  const maxValue = Math.max(...values);

  return (
    <div className="flex h-40 items-end justify-between px-2">
      {months.map((month, index) => (
        <div key={month} className="flex flex-col items-center">
          <div 
            className="w-8 bg-primary-500 dark:bg-primary-400 rounded-t-md transition-all duration-700 hover:bg-primary-600"
            style={{ height: `${(values[index] / maxValue) * 100}%` }}
          ></div>
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{month}</span>
        </div>
      ))}
    </div>
  );
};

// Composant de liste
const ActivityList = () => {
  const activities = [
    { id: 1, action: 'Campagne démarrée', target: 'Promo Été 2025', time: 'Il y a 25 minutes', status: 'success' },
    { id: 2, action: 'Nouveau client', target: 'Tech Solutions Inc.', time: 'Il y a 2 heures', status: 'info' },
    { id: 3, action: 'Panneau maintenance', target: 'Boulevard Central #12', time: 'Il y a 5 heures', status: 'warning' },
    { id: 4, action: 'Campagne terminée', target: 'Lancement Produit XYZ', time: 'Hier', status: 'neutral' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'info' ? 'bg-blue-500' : activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.target}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-slide-in-bottom">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Bienvenue sur votre tableau de bord</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            Exporter
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center">
            <Plus size={16} className="mr-1" />
            Nouvelle Campagne
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Panneaux" 
          value={dashboardData.totalPanels} 
          icon={<Layers size={24} className="text-blue-500" />} 
          color="bg-blue-100 dark:bg-blue-900/30"
          trend="up"
          percent="12"
        />
        <StatCard 
          title="Panneaux Disponibles" 
          value={dashboardData.availablePanels} 
          icon={<CheckCircle size={24} className="text-green-500" />} 
          color="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard 
          title="Panneaux Occupés" 
          value={dashboardData.occupiedPanels} 
          icon={<BarChart size={24} className="text-purple-500" />} 
          color="bg-purple-100 dark:bg-purple-900/30"
          trend="up"
          percent="8"
        />
        <StatCard 
          title="Campagnes Actives" 
          value={dashboardData.activeCampaigns} 
          icon={<Activity size={24} className="text-red-500" />} 
          color="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Performance Mensuelle</h2>
            <select className="text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary-500 focus:border-primary-500">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <SimpleBarChart />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Aperçu Clients</h2>
            <Link to="/dashboard/clients" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Voir tous
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Users size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dashboardData.totalClients}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dashboardData.activeClients}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clients Actifs</p>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dashboardData.availableSoonPanels}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Disponibles Bientôt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Campagnes Récentes</h2>
            <Link to="/dashboard/campaigns" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Voir toutes
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campagne
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progrès
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { id: 1, name: 'Promo Été 2025', client: 'FashionBrand', status: 'En cours', progress: 75 },
                  { id: 2, name: 'Lancement Produit XYZ', client: 'Tech Solutions', status: 'En attente', progress: 0 },
                  { id: 3, name: 'Festival Annuel', client: 'Ville de Paris', status: 'En cours', progress: 45 },
                  { id: 4, name: 'Soldes Hiver', client: 'EcoStore', status: 'Planifiée', progress: 0 },
                ].map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.client}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'En cours' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : campaign.status === 'En attente' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {campaign.progress > 0 ? (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Non démarré</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activités Récentes</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Rafraîchir
            </button>
          </div>
          <ActivityList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;