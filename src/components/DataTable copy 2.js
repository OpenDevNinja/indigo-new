import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FilePlus, 
  FileDown, 
  Edit, 
  Trash2, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Composant de tableau de données avancé avec fonctionnalités de filtrage, recherche et exportation
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.data - Données à afficher dans le tableau
 * @param {Array} props.columns - Configuration des colonnes
 * @param {Function} props.onAdd - Fonction pour ajouter un élément
 * @param {Function} props.onEdit - Fonction pour modifier un élément
 * @param {Function} props.onDelete - Fonction pour supprimer un élément
 * @param {String} props.title - Titre du tableau
 * @param {Boolean} props.loading - État de chargement
 * @returns {JSX.Element} Composant DataTable
 */
const DataTable = ({ 
  data = [], 
  columns = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  title, 
  loading = false,
  emptyMessage = "Aucune donnée disponible" 
}) => {
  // États pour la gestion du tableau
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Mise à jour des données filtrées lorsque les données brutes changent
  useEffect(() => {
    applyFilters();
  }, [data, searchTerm, activeFilters]);

  // Appliquer les filtres et la recherche aux données
  const applyFilters = () => {
    let result = [...data];
    
    // Appliquer la recherche
    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(item => {
        return columns.some(column => {
          const value = column.accessor(item);
          return value && value.toString().toLowerCase().includes(lowercasedTerm);
        });
      });
    }
    
    // Appliquer les filtres actifs
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          const columnDef = columns.find(col => col.id === key);
          if (columnDef) {
            const itemValue = columnDef.accessor(item);
            return itemValue === value;
          }
          return true;
        });
      }
    });
    
    // Appliquer le tri
    if (sortConfig.key) {
      const column = columns.find(col => col.id === sortConfig.key);
      if (column) {
        result.sort((a, b) => {
          const valueA = column.accessor(a) || '';
          const valueB = column.accessor(b) || '';
          
          // Conversion des valeurs pour la comparaison
          const compareA = valueA.toString().toLowerCase();
          const compareB = valueB.toString().toLowerCase();
          
          if (compareA < compareB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (compareA > compareB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
    }
    
    setFilteredData(result);
  };

  // Gérer le tri des colonnes
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Obtenir l'icône de tri pour une colonne
  const getSortIcon = (columnId) => {
    if (sortConfig.key !== columnId) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp size={16} className="inline ml-1" /> : 
      <ChevronDown size={16} className="inline ml-1" />;
  };

  // Pagination - obtenir les données de la page actuelle
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Exporter les données au format PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    
    // Préparation des données pour le tableau
    const tableColumn = columns
      .filter(col => !col.hideOnExport)
      .map(col => col.header);
    
    const tableRows = filteredData.map(item => {
      return columns
        .filter(col => !col.hideOnExport)
        .map(col => {
          const value = col.accessor(item);
          return value !== null && value !== undefined ? value.toString() : '';
        });
    });
    
    // Générer le tableau
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [142, 48, 136] } // Couleur primaire
    });
    
    // Enregistrer le PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Préparer les données pour l'export CSV
  const prepareCSVData = () => {
    const csvData = filteredData.map(item => {
      const row = {};
      columns
        .filter(col => !col.hideOnExport)
        .forEach(col => {
          row[col.header] = col.accessor(item);
        });
      return row;
    });
    return csvData;
  };

  // Gérer le changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Préparer les pages pour la pagination
  const pageNumbers = [];
  const maxPageButtons = 5;
  
  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Logique pour limiter le nombre de boutons de pagination
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      {/* En-tête du tableau */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Info size={20} className="mr-2 text-primary-500" />
          {title}
          {loading && (
            <span className="ml-2 inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
          )}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-2">
          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64 transition-colors duration-200"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
          </div>
          
          {/* Bouton de filtrage */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <Filter size={18} className="mr-1 text-primary-500" />
              Filtres
              {Object.keys(activeFilters).length > 0 && (
                <span className="ml-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button>
            
            {/* Menu de filtrage */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-3 transition-all duration-200">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Filtres avancés
                </h3>
                {columns
                  .filter(col => col.filterable)
                  .map(column => (
                    <div key={column.id} className="mb-2">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {column.header}
                      </label>
                      {column.filterComponent ? (
                        column.filterComponent({
                          value: activeFilters[column.id] || '',
                          onChange: (value) => setActiveFilters({
                            ...activeFilters,
                            [column.id]: value
                          })
                        })
                      ) : (
                        <input
                          type="text"
                          value={activeFilters[column.id] || ''}
                          onChange={(e) => setActiveFilters({
                            ...activeFilters,
                            [column.id]: e.target.value
                          })}
                          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                      )}
                    </div>
                  ))}
                <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setActiveFilters({});
                      setShowFilterMenu(false);
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFilterMenu(false)}
                    className="text-sm bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors duration-200"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={onAdd}
              className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200"
            >
              <FilePlus size={18} className="mr-1" />
              Ajouter
            </button>
            
            <div className="relative group">
              <button
                className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
              >
                <FileDown size={18} className="mr-1 text-gray-600 dark:text-gray-400" />
                Exporter
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block z-10">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <ul className="py-1">
                    <li>
                      <CSVLink
                        data={prepareCSVData()}
                        filename={`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      >
                        Exporter en CSV
                      </CSVLink>
                    </li>
                    <li>
                      <button
                        onClick={exportToPDF}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Exporter en PDF
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corps du tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map(column => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => column.sortable && requestSort(column.id)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {paginate(filteredData).length > 0 ? (
              paginate(filteredData).map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  {columns.map(column => (
                    <td 
                      key={`${row.id || rowIndex}-${column.id}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                    >
                      {column.cell ? column.cell(row) : column.accessor(row)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Chargement des données...</span>
                    </div>
                  ) : (
                    emptyMessage
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            Affichage de 
            <span className="font-medium mx-1">
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}
            </span> 
            à 
            <span className="font-medium mx-1">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span> 
            sur 
            <span className="font-medium mx-1">{filteredData.length}</span> 
            résultats
          </div>
          
          <div className="mt-2 sm:mt-0 flex">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Précédent</span>
                <ChevronDown size={16} className="transform rotate-90" />
              </button>
              
              {pageNumbers.map((number, index) => (
                <button
                  key={index}
                  onClick={() => number !== '...' && handlePageChange(number)}
                  disabled={number === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    number === currentPage
                      ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } text-sm font-medium`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Suivant</span>
                <ChevronDown size={16} className="transform -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;