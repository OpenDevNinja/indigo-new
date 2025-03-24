import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  File,
  
} from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Composant de tableau de données réutilisable avec fonctionnalités de filtrage, 
 * pagination, recherche et exportation
 */
const DataTable = ({ 
  data, 
  columns, 
  title, 
  onEdit, 
  onDelete, 
  onAdd, 
  loading,
  itemsPerPageOptions = [10, 25, 50],
  filename = "export-data"
}) => {
  // États pour la gestion du tableau
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Préparation des données pour l'exportation PDF
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Ajouter un titre au document
      doc.setFontSize(16);
      doc.text(`${title}`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 14, 22);
      
      // Préparation des en-têtes et des données pour le tableau
      const headers = columns
        .filter(column => !column.excludeFromExport)
        .map(column => column.header);
      
      const pdfData = filteredData.map(item => {
        return columns
          .filter(column => !column.excludeFromExport)
          .map(column => item[column.accessor] || '');
      });
      
      // Générer le tableau
      doc.autoTable({
        head: [headers],
        body: pdfData,
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
      
      // Sauvegarder le PDF
      doc.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Le fichier PDF a été généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Une erreur est survenue lors de la génération du PDF");
    }
  };

  // Filtrer et trier les données en fonction de la recherche et du tri
  useEffect(() => {
    let filtered = [...data];
    
    // Appliquer le filtrage par recherche
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(item => {
        // Recherche dans toutes les colonnes qui peuvent être affichées
        return columns.some(column => {
          if (column.searchable === false) return false;
          const value = item[column.accessor];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Appliquer le tri
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [data, searchTerm, sortConfig]);
  
  // Fonction pour trier les données
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Fonction pour changer de page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Fonction pour confirmer la suppression
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      {/* En-tête du tableau */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white w-full sm:w-auto"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Bouton pour exporter les données en PDF */}
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <File size={18} />
            <span className="hidden md:inline">Exporter PDF</span>
          </button>
          
          {/* Bouton pour ajouter un élément */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Ajouter</span>
          </button>
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
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
                  onClick={() => column.sortable !== false && requestSort(column.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {sortConfig.key === column.accessor && (
                      <span className="text-primary-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex justify-center">
                    <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  {columns.map((column) => (
                    <td key={column.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {column.cell ? column.cell(item) : item[column.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
                        aria-label="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune donnée trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span>
            Affichage de {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length} éléments
          </span>
          <div className="ml-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option} par page
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1">
            {[...Array(Math.min(totalPages, 5)).keys()]
              .map(i => {
                // Si le nombre de pages est supérieur à 5, gérer l'affichage des pages
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } text-sm font-medium rounded-md transition-colors duration-150`}
                  >
                    {pageNum}
                  </button>
                );
              })}
          </div>
          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;