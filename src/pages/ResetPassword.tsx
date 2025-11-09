import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KeyRound, CheckCircle } from 'lucide-react';
import { resetPassword } from '../lib/api';
import { extractErrorMessage } from '../lib/api-client';

type ResetPasswordProps = {
  onNavigate: (page: string) => void;
};

export default function ResetPassword({ onNavigate }: ResetPasswordProps) {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError('Lien invalide ou expiré. Veuillez refaire une demande.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Mot de passe mis à jour</h2>
          <p className="text-gray-600 mb-6">Vous pouvez désormais vous connecter avec votre nouveau mot de passe.</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            Accéder à la connexion
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
            <KeyRound className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Définir un nouveau mot de passe</h2>
          <p className="text-gray-600">Sécurisez l’accès à votre espace jrdriving.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="********"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
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
