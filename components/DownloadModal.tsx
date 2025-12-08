import React, { useState } from 'react';
import { X, Smartphone, Mail, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { NeoButton } from './NeoButton';
import { supabase } from '../lib/supabaseClient';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Appel réel à Supabase Auth (Magic Link)
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;

      setStatus('sent');
      // On ne ferme pas automatiquement pour laisser l'utilisateur lire le message
    } catch (error: any) {
      console.error('Erreur Supabase:', error);
      setStatus('error');
      setErrorMessage(error.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-givd-dark/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-givd-dark shadow-neo w-full max-w-md relative p-8 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 border-2 border-transparent hover:border-givd-dark transition-all"
        >
          <X size={24} />
        </button>

        <h3 className="font-display font-bold text-3xl mb-4">Connexion / Inscription</h3>
        
        {status === 'sent' ? (
          <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-givd-green rounded-full border-2 border-givd-dark flex items-center justify-center mb-4 shadow-neo-sm">
              <Check size={32} />
            </div>
            <p className="text-xl font-bold">Lien magique envoyé !</p>
            <p className="text-gray-600 mt-2">Vérifiez votre boîte mail ({email}) pour vous connecter.</p>
            <NeoButton size="sm" onClick={onClose} className="mt-6">Fermer</NeoButton>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-lg">
              Entrez votre email pour recevoir un lien de connexion sécurisé (Magic Link).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-bold text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-givd-dark focus:outline-none focus:ring-4 focus:ring-givd-blue/20 font-medium"
                  />
                </div>
              </div>
              
              {status === 'error' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-start gap-2">
                   <AlertTriangle size={18} className="mt-1 flex-shrink-0" />
                   <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <NeoButton 
                type="submit" 
                className="w-full flex justify-center items-center gap-2" 
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Envoi...' : 'Recevoir le lien'}
                {!status && <ArrowRight size={20} />}
              </NeoButton>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Propulsé par Supabase Auth. Aucun mot de passe requis.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};