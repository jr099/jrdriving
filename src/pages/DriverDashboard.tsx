import { useEffect, useState } from 'react';
import { Truck, Clock, MapPin, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, type Mission } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  normalizeMissionStatus,
  missionStatusToDatabase,
  getMissionStatusLabel,
  getMissionStatusBadgeClass,
  type NormalizedMissionStatus,
} from '../lib/missions';

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
    loadMissions();
  }, [profile]);

  const loadMissions = async () => {
    if (!profile) return;

    try {
      const { data: driverData } = await supabase
        .from('drivers')
        .select('id, total_missions, total_kilometers')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (!driverData) {
        setLoading(false);
        return;
      }

      const { data: missionsData, error } = await supabase
        .from('missions')
        .select('*')
        .eq('driver_id', driverData.id)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      setMissions(missionsData || []);
      const missionList = missionsData ?? [];
      setStats({
        totalMissions: driverData.total_missions || missionList.length || 0,
        inProgress: missionList.filter((m: Mission) => normalizeMissionStatus(m.status) === 'in_progress').length,
        completed: missionList.filter((m: Mission) => normalizeMissionStatus(m.status) === 'done').length,
        totalKm: driverData.total_kilometers || 0,
      });
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMissionStatus = async (
    missionId: string,
    newStatus: NormalizedMissionStatus
  ) => {
    try {
      const updates: Record<string, unknown> = {
        status: missionStatusToDatabase(newStatus),
      };

      if (newStatus === 'in_progress') {
        updates.actual_start_time = new Date().toISOString();
      } else if (newStatus === 'done') {
        updates.actual_end_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('missions')
        .update(updates)
        .eq('id', missionId);

      if (error) throw error;

      loadMissions();
    } catch (error) {
      console.error('Error updating mission:', error);
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
          <p className="text-gray-600">Bienvenue, {profile?.full_name}</p>
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
              {missions.map((mission) => {
                const status = normalizeMissionStatus(mission.status);
                return (
                  <div key={mission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono font-semibold text-slate-900">
                            {mission.mission_number}
                          </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getMissionStatusBadgeClass(status)}`}
                        >
                          {getMissionStatusLabel(status)}
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
                                {mission.departure_address}, {mission.departure_city}
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
                                {mission.arrival_address}, {mission.arrival_city}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(mission.scheduled_date).toLocaleDateString('fr-FR')}
                          {mission.scheduled_time && ` à ${mission.scheduled_time}`}
                        </div>

                        {mission.distance_km && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {mission.distance_km} km
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
                      {status === 'assigned' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Démarrer
                        </button>
                      )}
                      {status === 'in_progress' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'done')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
