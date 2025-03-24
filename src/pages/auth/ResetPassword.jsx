// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { KeyRound, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from '../../services/auth';

const ResetPassword = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { token } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    // Extraire le token de l'URL si non disponible dans les paramètres
    useEffect(() => {
        if (!token) {
            const searchParams = new URLSearchParams(location.search);
            const tokenFromQuery = searchParams.get('token');
            
            if (!tokenFromQuery) {
                toast.error('Lien de réinitialisation invalide ou expiré');
                setTimeout(() => navigate('/forgot-password'), 3000);
            }
        }
    }, [token, location, navigate]);

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
        
        // Obtenir le token soit des paramètres, soit de la query
        const resetToken = token || new URLSearchParams(location.search).get('token');
        
        try {
            // Appel du service pour réinitialiser le mot de passe
            await AuthService.resetPassword({
                token: resetToken,
                new_password: formData.newPassword
            });
            
            toast.success('Mot de passe réinitialisé avec succès!');
            setResetComplete(true);
            
            // Redirection vers la page de connexion après un délai
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            
            const errorMessage = error.message || 
                'Une erreur est survenue lors de la réinitialisation du mot de passe';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            
            <div className="w-full max-w-md animate-slide-in-bottom">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-5 bg-gradient-tech text-white text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                {resetComplete ? <CheckCircle size={24} /> : <KeyRound size={24} />}
                            </div>
                        </div>
                        <h1 className="text-2xl font-display font-bold">
                            {resetComplete ? 'Mot de passe réinitialisé' : 'Réinitialiser votre mot de passe'}
                        </h1>
                        <p className="text-sm mt-1 text-blue-100">
                            {resetComplete 
                                ? 'Votre mot de passe a été modifié avec succès' 
                                : 'Créez un nouveau mot de passe sécurisé'
                            }
                        </p>
                    </div>

                    {resetComplete ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Se connecter maintenant
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="font-medium mb-1">Le mot de passe doit :</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Contenir au moins 8 caractères</li>
                                    <li>Inclure au moins une lettre majuscule</li>
                                    <li>Inclure au moins un chiffre</li>
                                    <li>Inclure au moins un caractère spécial</li>
                                </ul>
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
                                    'Réinitialiser le mot de passe'
                                )}
                            </button>
                        </form>
                    )}
                </div>
                
                <div className="text-center mt-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                    >
                        Retour à la page de connexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;