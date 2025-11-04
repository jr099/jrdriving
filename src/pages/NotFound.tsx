import { AlertTriangle } from 'lucide-react';
import { usePageNavigation } from '../hooks/usePageNavigation';

export default function NotFound() {
  const handleNavigate = usePageNavigation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-orange-100 text-orange-600 rounded-full p-6 mb-6">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Page introuvable</h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée. Utilisez la navigation pour revenir à l&apos;accueil.
      </p>
      <button
        onClick={() => handleNavigate('home')}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );
}
