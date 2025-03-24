import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Composant Modal réutilisable pour afficher des formulaires
 * 
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - Indique si le modal est ouvert
 * @param {Function} props.onClose - Fonction appelée pour fermer le modal
 * @param {string} props.title - Titre du modal
 * @param {ReactNode} props.children - Contenu du modal
 * @param {string} props.size - Taille du modal (sm, md, lg, xl)
 * @returns {JSX.Element|null} Composant Modal ou null si fermé
 */
const FormModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Gestion de l'animation d'ouverture et fermeture
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isVisible && !isOpen) {
    return null;
  }
  
  // Déterminer la largeur du modal en fonction de la taille
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  const modalSizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Contenu du modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={`${modalSizeClass} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* En-tête du modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Corps du modal */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;