// src/components/ModalForm.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Composant de modal réutilisable pour les formulaires
 */
const ModalForm = ({ isOpen, onClose, title, children }) => {
  // Effet pour désactiver le défilement du corps quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Fonction de nettoyage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Ferme la modal si on clique sur la touche Échap
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Ne rien rendre si la modal n'est pas ouverte
  if (!isOpen) return null;
  
  // Empêcher la propagation des clics dans la modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-auto overflow-hidden transform transition-all duration-300 animate-slide-in-bottom"
        onClick={handleModalContentClick}
      >
        {/* En-tête de la modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenu de la modal */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalForm;