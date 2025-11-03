import { useState } from 'react';
import { LogIn, UserPlus, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../lib/api-types';
import { getRoleDefaultPage } from '../lib/navigation';
import { extractErrorMessage } from '../lib/api-client';

type LoginProps = {
  onNavigate: (page: string) => void;
};

export default function Login({ onNavigate }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'client' as Profile['role'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = isLogin
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, formData.fullName, formData.phone, formData.role);

      const role = session.profile.role ?? formData.role;
      onNavigate(getRoleDefaultPage(role));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Accédez à votre espace personnel' : 'Créez votre compte jrdriving'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Type de compte
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="client">Client</option>
                  <option value="driver">Chauffeur</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="jean.dupont@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="********"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Chargement...</span>
            ) : (
              <>
                {isLogin ? <LogIn className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                {isLogin ? 'Se connecter' : 'Créer mon compte'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <button onClick={() => setIsLogin(false)} className="text-orange-600 hover:underline">
              Pas encore de compte ? Inscrivez-vous
            </button>
          ) : (
            <button onClick={() => setIsLogin(true)} className="text-orange-600 hover:underline">
              Déjà inscrit ? Connectez-vous
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
