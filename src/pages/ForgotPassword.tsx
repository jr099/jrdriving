import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '../lib/api';
import { extractErrorMessage } from '../lib/api-client';

type ForgotPasswordProps = {
  onNavigate: (page: string) => void;
};

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Vérifiez votre boîte mail</h2>
          <p className="text-gray-600 mb-6">
            Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation de mot de passe.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Mot de passe oublié</h2>
          <p className="text-gray-600">Recevez un lien sécurisé pour réinitialiser votre mot de passe.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="jean.dupont@email.com"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? 'Envoi en cours...' : (<><Send className="h-5 w-5 mr-2" />Envoyer le lien</>)}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full text-sm text-gray-600 hover:text-orange-600"
          >
            Retour à la connexion
          </button>
        </form>
      </div>
    </div>
  );
}
