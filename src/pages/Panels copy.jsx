// src/pages/Panels.jsx
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Map, List, Grid, ChevronLeft, ChevronRight,
  ArrowUpDown, CheckCircle, AlertCircle, Clock, MoreVertical, Image
} from 'lucide-react';

const PanelCard = ({ panel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-custom transition-all duration-300 overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image size={40} className="text-gray-400 dark:text-gray-500" />
        </div>
        {panel.image && (
          <img 
            src={panel.image} 
            alt={panel.name} 
            className="w-full h-full object-cover"
          />
        )}
        <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${
          panel.status === 'Disponible' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : panel.status === 'Occupé' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {panel.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">{panel.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{panel.location}</p>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>Type: {panel.type}</span>
          <span>Taille: {panel.size}</span>
        </div>
      </div>
    </div>
  );
};

const PanelListItem = ({ panel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-custom transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="sm:flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">{panel.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{panel.location}</p>
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            panel.status === 'Disponible' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : panel.status === 'Occupé' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {panel.status}
          </span>
          
          <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-4">Type: {panel.type}</span>
            <span>Taille: {panel.size}</span>
          </div>
          
          <button className="ml-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Panels = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  
  // Données fictives des panneaux
  const panels = [
    { id: 1, name: 'Panneau Central', location: 'Boulevard Haussmann, Paris', status: 'Disponible', type: 'Digital', size: '4x3m' },
    { id: 2, name: 'Panneau Plaza', location: 'Avenue des Champs-Élysées, Paris', status: 'Occupé', type: 'Standard', size: '6x3m' },
    { id: 3, name: 'Panneau Gare', location: 'Gare du Nord, Paris', status: 'Occupé', type: 'Digital', size: '5x2.5m' },
    { id: 4, name: 'Panneau Shopping', location: 'Centre Commercial Belle Épine', status: 'Disponible', type: 'LED', size: '3x2m' },
    { id: 5, name: 'Panneau Autoroute', location: 'A1 Sortie 4, Paris Nord', status: 'Maintenance', type: 'Standard', size: '8x4m' },
    { id: 6, name: 'Panneau Centre-Ville', location: 'Place de la République, Paris', status: 'Disponible', type: 'Digital', size: '4x3m' },
    { id: 7, name: 'Panneau Stade', location: 'Stade de France, Saint-Denis', status: 'Occupé', type: 'LED', size: '10x5m' },
    { id: 8, name: 'Panneau Aéroport', location: 'Aéroport Charles de Gaulle, Terminal 2', status: 'Disponible', type: 'Digital', size: '4x2m' },
  ];
  
  // Filtrage des panneaux
  const filteredPanels = filter === 'all' 
    ? panels 
    : panels.filter(panel => panel.status === (
        filter === 'available' ? 'Disponible' : 
        filter === 'occupied' ? 'Occupé' : 'Maintenance'
      ));

  return (
    <div className="space-y-6 animate-slide-in-bottom">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Panneaux</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gérez et surveillez tous vos panneaux publicitaires</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center">
            <Plus size={16} className="mr-1" />
            Ajouter un Panneau
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un panneau..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="relative ml-3">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
                <Filter size={16} className="mr-1.5" />
                Filtres
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  filter === 'all' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  filter === 'available' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setFilter('occupied')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  filter === 'occupied' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Occupés
              </button>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  viewMode === 'map' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Map size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques sommaires */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Panneaux Disponibles</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {panels.filter(p => p.status === 'Disponible').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Panneaux Occupés</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {panels.filter(p => p.status === 'Occupé').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
            <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">En Maintenance</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {panels.filter(p => p.status === 'Maintenance').length}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des panneaux */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPanels.map(panel => (
            <PanelCard key={panel.id} panel={panel} />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredPanels.map(panel => (
            <PanelListItem key={panel.id} panel={panel} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-96 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Map size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Vue carte</h3>
            <p className="text-sm mt-2">Visualisation des panneaux sur une carte interactive</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de <span className="font-medium">{1}</span> à <span className="font-medium">{filteredPanels.length}</span> sur <span className="font-medium">{panels.length}</span> panneaux
        </div>
        
        <div className="flex space-x-1">
          <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          <button className="px-3 py-1 rounded-lg bg-primary-600 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            2
          </button>
          <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panels;