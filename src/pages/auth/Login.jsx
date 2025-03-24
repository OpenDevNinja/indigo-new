// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeProvider';

import { toast, ToastContainer } from 'react-toastify'; // Pour les notifications
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from '../../services/auth';
import { BaseApiService } from '../../services/api';

const Login = () => {
    const { theme, toggleTheme } = useTheme();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const token = BaseApiService.getToken();
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Utiliser le service d'authentification
            const response = await AuthService.login({
                email: credentials.email,
                password: credentials.password
            });

            // Afficher un message de succès
            toast.success('Connexion réussie!');

            // Redirection vers le dashboard après une courte pause
            setTimeout(() => {
                // Rediriger vers la page demandée ou le dashboard par défaut
                const redirectTo = location.state?.from?.pathname || '/dashboard';
                navigate(redirectTo, { replace: true });
            }, 1000);
        } catch (error) {
            // Gestion des erreurs d'authentification
            console.error('Erreur de connexion:', error);

            // Afficher un message d'erreur approprié
            const errorMessage = error.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Implémenter la navigation vers la page de récupération de mot de passe
        navigate('/forgot-password');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <Moon size={20} className="text-primary-500" /> : <Sun size={20} className="text-yellow-400" />}
            </button>

            <div className="w-full max-w-md animate-slide-in-bottom">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-5 bg-gradient-tech text-white text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <LogIn size={24} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-display font-bold">Panneau Admin</h1>
                        <p className="text-sm mt-1 text-blue-100">Système de gestion de panneaux publicitaires</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Adresse Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={credentials.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    name="remember_me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Se souvenir de moi
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                            >
                                Mot de passe oublié?
                            </button>
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
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Panneau Admin. Tous droits réservés.
                </p>
            </div>
        </div>
    );
};

export default Login;