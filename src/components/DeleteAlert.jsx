// src/components/DeleteAlert.jsx
import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

/**
 * Composant d'alerte de confirmation pour la suppression
 */
const DeleteAlert = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-auto overflow-hidden transform transition-all duration-300 animate-slide-in-bottom">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-2">
            Confirmer la suppression
          </h3>
          
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Êtes-vous sûr de vouloir supprimer {itemName || "cet élément"} ? Cette action est irréversible.
          </p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center"
            >
              <X size={16} className="mr-2" />
              Annuler
            </button>
            
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 flex items-center"
            >
              <Check size={16} className="mr-2" />
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;