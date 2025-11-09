import { useState } from 'react';
import { Search, MapPin, Clock, Truck, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { trackMission } from '../lib/api';
import { extractErrorMessage } from '../lib/api-client';
import type { MissionTracking } from '../lib/api-types';

const STATUS_LABELS: Record<MissionTracking['status'], { label: string; color: string; description: string }> = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Mission enregistrée, en attente de validation planification.',
  },
  assigned: {
    label: 'Assignée',
    color: 'bg-blue-100 text-blue-800',
    description: 'Un chauffeur est affecté et prépare le déplacement.',
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-orange-100 text-orange-800',
    description: 'Le véhicule est en train d’être convoyé vers sa destination.',
  },
  completed: {
    label: 'Terminée',
    color: 'bg-green-100 text-green-800',
    description: 'Mission finalisée, véhicule livré au client.',
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800',
    description: 'Mission annulée à la demande du client ou pour raison opérationnelle.',
  },
};

export default function Tracking() {
  const [missionNumber, setMissionNumber] = useState('');
  const [mission, setMission] = useState<MissionTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!missionNumber.trim()) return;

    setLoading(true);
    setError('');
    setMission(null);

    try {
      const result = await trackMission(missionNumber.trim());
      setMission(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Search className="h-16 w-16 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Suivre une mission</h1>
          <p className="text-lg text-gray-600">
            Entrez votre numéro de mission pour suivre le statut et la progression du convoyage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Numéro de mission</label>
              <input
                type="text"
                value={missionNumber}
                onChange={(event) => setMissionNumber(event.target.value)}
                placeholder="JR-2024-0001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Consulter'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Numéro fourni dans votre email de confirmation ou accessible depuis votre espace client.
          </p>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-8 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {mission && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Numéro de mission</p>
                <h2 className="text-2xl font-bold text-slate-900">{mission.missionNumber}</h2>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_LABELS[mission.status].color}`}>
                {STATUS_LABELS[mission.status].label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Itinéraire</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Départ</p>
                      <p className="text-base font-semibold text-slate-900">{mission.departureCity}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Arrivée</p>
                      <p className="text-base font-semibold text-slate-900">{mission.arrivalCity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informations logistiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Date planifiée</p>
                      <p className="text-base font-semibold text-slate-900">
                        {new Date(mission.scheduledDate).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-slate-700" />
                    <div>
                      <p className="text-sm text-gray-500">Chauffeur assigné</p>
                      <p className="text-base font-semibold text-slate-900">{mission.driverName ?? 'En cours d’affectation'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Suivi automatique</h3>
              <p className="text-sm text-gray-700">{STATUS_LABELS[mission.status].description}</p>
              <p className="text-xs text-gray-500 mt-3">
                Dernière mise à jour : {new Date(mission.updatedAt).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'numeric' })}
              </p>
            </div>

            {mission.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3 text-green-800">
                <CheckCircle className="h-6 w-6" />
                <p className="text-sm">
                  Mission clôturée. Vos documents (ordre de mission, preuve de livraison) sont disponibles dans votre espace client.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
