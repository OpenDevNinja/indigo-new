import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileDown, 
  Trash2, 
  Edit, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog } from '@/components/ui/alert-dialog';

/**
 * Composant DataTable réutilisable avec fonctionnalités de filtrage, tri, pagination et export CSV
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.data - Données à afficher dans le tableau
 * @param {Array} props.columns - Configuration des colonnes (titre, clé, triable, etc.)
 * @param {Function} props.onEdit - Fonction appelée lors de la modification d'un élément
 * @param {Function} props.onDelete - Fonction appelée lors de la suppression d'un élément
 * @param {Function} props.onAdd - Fonction appelée lors de l'ajout d'un élément
 * @param {string} props.title - Titre du tableau
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 * @returns {JSX.Element} Composant DataTable
 */
const DataTable = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onAdd, 
  title = "Données", 
  isLoading = false,
  searchKeys = [] // Clés sur lesquelles effectuer la recherche
}) => {
  // États pour la gestion du tableau
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Mise à jour des données filtrées lors du changement des données source
  useEffect(() => {
    let result = [...data];
    
    // Appliquer la recherche
    if (searchTerm) {
      result = result.filter(item => {
        return searchKeys.some(key => {
          const value = getNestedValue(item, key);
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Appliquer les filtres
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        result = result.filter(item => {
          const value = getNestedValue(item, key);
          return value && value.toString().toLowerCase() === filters[key].toLowerCase();
        });
      }
    });
    
    // Appliquer le tri
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key) || '';
        const bValue = getNestedValue(b, sortConfig.key) || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
  }, [data, searchTerm, filters, sortConfig]);
  
  // Fonction pour accéder aux valeurs imbriquées (a.b.c)
  const getNestedValue = (obj, path) => {
    const keys = path.split('.');
    return keys.reduce((o, k) => (o || {})[k], obj);
  };

  // Fonction pour gérer le tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Préparation des données pour l'export CSV
  const csvData = filteredData.map(item => {
    const row = {};
    columns.forEach(column => {
      if (!column.exclude) {
        row[column.header] = getNestedValue(item, column.accessor);
      }
    });
    return row;
  });
  
  // Fonction pour gérer la suppression
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
    }
    setIsDeleteAlertOpen(false);
    setItemToDelete(null);
  };
  
  const cancelDelete = () => {
    setIsDeleteAlertOpen(false);
    setItemToDelete(null);
  };

  // Options pour le nombre d'éléments par page
  const perPageOptions = [5, 10, 25, 50, 100];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* En-tête du tableau avec titre et actions */}
      <div className="p-4 flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Bouton filtre */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filtrer</span>
            </button>
            
            {/* Menu de filtres */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Filtres</h3>
                  <button onClick={() => setShowFilterMenu(false)}>
                    <X className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                  </button>
                </div>
                <div className="p-3 space-y-3">
                  {columns.map((column) => (
                    column.filterable && (
                      <div key={`filter-${column.accessor}`} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {column.header}
                        </label>
                        <input
                          type="text"
                          value={filters[column.accessor] || ''}
                          onChange={(e) => setFilters({
                            ...filters,
                            [column.accessor]: e.target.value
                          })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder={`Filtrer par ${column.header.toLowerCase()}`}
                        />
                      </div>
                    )
                  ))}
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setFilters({})}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setShowFilterMenu(false)}
                      className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bouton d'export CSV */}
          <CSVLink
            data={csvData}
            filename={`${title.toLowerCase().replace(/ /g, '-')}-export.csv`}
            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileDown className="h-5 w-5" />
            <span>Exporter</span>
          </CSVLink>
          
          {/* Bouton d'ajout */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Corps du tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.accessor}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <button onClick={() => handleSort(column.accessor)}>
                        {sortConfig.key === column.accessor ? (
                          sortConfig.direction === 'asc' ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          )
                        ) : (
                          <SortAsc className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    <span className="ml-2">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr 
                  key={item.id || index} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={`${item.id || index}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
                      {column.cell ? column.cell(item) : (
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {getNestedValue(item, column.accessor) || '—'}
                        </div>
                      )}
                    </td>
                  ))}
                  
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination et affichage du nombre d'éléments par page */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span>Afficher</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Retour à la première page
            }}
            className="mx-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            {perPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span>éléments par page</span>
        </div>
        
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-2 sm:mt-0">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> sur{' '}
              <span className="font-medium">{filteredData.length}</span> résultats
            </p>
          </div>
          
          <div className="flex justify-end mt-2 sm:mt-0">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span className="sr-only">Précédent</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Pages */}
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                  if (i === 4) pageNum = totalPages;
                  if (i === 3 && totalPages > 5) pageNum = '...';
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                  if (i === 0) pageNum = 1;
                  if (i === 1 && totalPages > 5) pageNum = '...';
                } else {
                  if (i === 0) pageNum = 1;
                  if (i === 1) pageNum = '...';
                  if (i === 2) pageNum = currentPage;
                  if (i === 3) pageNum = '...';
                  if (i === 4) pageNum = totalPages;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => pageNum !== '...' && setCurrentPage(pageNum)}
                    disabled={pageNum === '...'}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      pageNum === currentPage
                        ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } text-sm font-medium`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span className="sr-only">Suivant</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Alerte de confirmation de suppression */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </AlertDialog>
    </div>
  );
};

export default DataTable;