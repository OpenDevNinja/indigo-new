// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from '../../services/auth';

const ForgotPassword = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError('L\'adresse email est requise');
            return false;
        } else if (!emailRegex.test(email)) {
            setError('Veuillez entrer une adresse email valide');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Appel du service pour demander une réinitialisation de mot de passe
            await AuthService.requestPasswordReset({ email });
            
            toast.success('Instructions de réinitialisation envoyées à votre adresse email');
            setRequestSent(true);
            
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation:', error);
            
            // Même en cas d'erreur, ne pas indiquer si l'email existe pour des raisons de sécurité
            toast.info('Si cette adresse email est associée à un compte, vous recevrez des instructions pour réinitialiser votre mot de passe.');
            setRequestSent(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            
            <div className="w-full max-w-md animate-slide-in-bottom">
                <button 
                    onClick={() => navigate('/login')}
                    className="mb-4 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    <span>Retour à la page de connexion</span>
                </button>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-5 bg-gradient-tech text-white text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Mail size={24} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-display font-bold">
                            {requestSent ? 'Vérifiez votre email' : 'Mot de passe oublié?'}
                        </h1>
                        <p className="text-sm mt-1 text-blue-100">
                            {requestSent 
                                ? 'Nous avons envoyé les instructions de réinitialisation' 
                                : 'Nous vous enverrons les instructions par email'
                            }
                        </p>
                    </div>

                    {requestSent ? (
                        <div className="p-6 space-y-4">
                            <div className="text-center text-gray-700 dark:text-gray-300">
                                <p className="mb-4">
                                    Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. 
                                    Veuillez vérifier votre boîte de réception et suivre les instructions.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    N'oubliez pas de vérifier également votre dossier de spam si vous ne trouvez pas l'email.
                                </p>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={() => setRequestSent(false)}
                                    className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Réessayer avec une autre adresse email
                                </button>
                                
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Retour à la connexion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Adresse Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                                    placeholder="votre@email.com"
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-500">{error}</p>
                                )}
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p>
                                    Entrez l'adresse email associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                                </p>
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
                                    'Envoyer les instructions'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;