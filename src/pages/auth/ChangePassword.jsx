// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from '../../services/auth';

const ChangePassword = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Réinitialiser l'erreur spécifique lors de la modification
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Le mot de passe actuel est requis';
        }
        
        if (!formData.newPassword) {
            newErrors.newPassword = 'Le nouveau mot de passe est requis';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Appel du service pour changer le mot de passe
            await AuthService.changePassword({
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            });
            
            toast.success('Mot de passe modifié avec succès!');
            
            // Réinitialiser le formulaire
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Redirection vers le dashboard après un court délai
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            
            const errorMessage = error.message || 
                'Une erreur est survenue lors du changement de mot de passe';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            
            <div className="w-full max-w-md animate-slide-in-bottom">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-4 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    <span>Retour au tableau de bord</span>
                </button>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-5 bg-gradient-tech text-white text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <KeyRound size={24} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-display font-bold">Changer votre mot de passe</h1>
                        <p className="text-sm mt-1 text-blue-100">Mettez à jour vos informations de sécurité</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mot de passe actuel
                            </label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                                placeholder="Entrez votre mot de passe actuel"
                            />
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nouveau mot de passe
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                                placeholder="Entrez votre nouveau mot de passe"
                            />
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                                placeholder="Confirmez votre nouveau mot de passe"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-70"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Changer le mot de passe'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;