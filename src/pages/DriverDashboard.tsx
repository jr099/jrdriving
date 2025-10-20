import { useEffect, useState } from 'react';
import { Truck, Clock, MapPin, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchDriverDashboard, updateMissionStatus as updateMissionStatusRequest } from '../lib/api';
import type { Mission } from '../lib/api-types';

export default function DriverDashboard() {
  const { profile } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMissions: 0,
    inProgress: 0,
    completed: 0,
    totalKm: 0,
  });

  useEffect(() => {
    if (!profile) return;

    (async () => {
      try {
        const { stats: driverStats, missions } = await fetchDriverDashboard();
        setMissions(missions);
        setStats(driverStats);
      } catch (error) {
        console.error('Error loading missions:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [profile]);

  const updateMissionStatus = async (missionId: number, newStatus: Mission['status']) => {
    try {
      await updateMissionStatusRequest(missionId, newStatus);
      const { stats: driverStats, missions } = await fetchDriverDashboard();
      setMissions(missions);
      setStats(driverStats);
    } catch (error) {
      console.error('Error updating mission:', error);
    }
  };

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Mission['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'assigned':
        return 'Assignée';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-12 w-12 text-orange-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tableau de bord chauffeur
          </h1>
          <p className="text-gray-600">Bienvenue, {profile?.fullName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total missions</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalMissions}</p>
              </div>
              <Truck className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En cours</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminées</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total km</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalKm.toLocaleString()}</p>
              </div>
              <MapPin className="h-10 w-10 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-slate-900">Mes missions</h2>
          </div>

          {missions.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune mission assignée pour le moment</p>
            </div>
          ) : (
            <div className="divide-y">
              {missions.map((mission) => (
                <div key={mission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono font-semibold text-slate-900">
                          {mission.missionNumber}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)}`}>
                          {getStatusText(mission.status)}
                        </span>
                        {mission.priority === 'express' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            EXPRESS
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-start mb-2">
                            <MapPin className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">Départ</p>
                              <p className="text-gray-600">
                                {mission.departureAddress}, {mission.departureCity}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-start mb-2">
                            <MapPin className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">Arrivée</p>
                              <p className="text-gray-600">
                                {mission.arrivalAddress}, {mission.arrivalCity}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(mission.scheduledDate).toLocaleDateString('fr-FR')}
                          {mission.scheduledTime && ` à ${mission.scheduledTime}`}
                        </div>

                        {mission.distanceKm && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {mission.distanceKm} km
                          </div>
                        )}

                        {mission.price && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {mission.price.toFixed(2)} €
                          </div>
                        )}
                      </div>

                      {mission.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                          <strong>Notes:</strong> {mission.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:ml-6">
                      {mission.status === 'assigned' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Démarrer
                        </button>
                      )}
                      {mission.status === 'in_progress' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'completed')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
