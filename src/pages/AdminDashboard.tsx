import { useEffect, useState } from 'react';
import { Users, Truck, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { fetchAdminDashboard } from '../lib/api';
import type { Mission, Quote } from '../lib/api-types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMissions: 0,
    activeMissions: 0,
    totalDrivers: 0,
    totalClients: 0,
    pendingQuotes: 0,
    revenue: 0,
  });
  const [recentMissions, setRecentMissions] = useState<Mission[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { stats: dashboardStats, recentMissions, pendingQuotes } = await fetchAdminDashboard();
      setStats(dashboardStats);
      setRecentMissions(recentMissions);
      setPendingQuotes(pendingQuotes);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-12 w-12 text-orange-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité jrdriving</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total missions</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalMissions}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.activeMissions} actives</p>
              </div>
              <Truck className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chauffeurs</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalDrivers}</p>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Clients</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalClients}</p>
              </div>
              <Users className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Devis en attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingQuotes}</p>
              </div>
              <FileText className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
                <p className="text-3xl font-bold text-green-600">{stats.revenue.toFixed(0)} €</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taux de réussite</p>
                <p className="text-3xl font-bold text-blue-600">98%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">Missions récentes</h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {recentMissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucune mission
                </div>
              ) : (
                recentMissions.map((mission) => (
                  <div key={mission.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-semibold">{mission.missionNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)}`}>
                        {mission.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{mission.departureCity} → {mission.arrivalCity}</p>
                      <div className="flex items-center mt-1 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(mission.scheduledDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">Devis en attente</h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {pendingQuotes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucun devis en attente
                </div>
              ) : (
                pendingQuotes.map((quote) => (
                  <div key={quote.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{quote.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{quote.departureLocation} → {quote.arrivalLocation}</p>
                      <p className="text-xs mt-1">Type: {quote.vehicleType}</p>
                      {quote.companyName && (
                        <p className="text-xs text-blue-600">{quote.companyName}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-all">
              Nouvelle mission
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-all">
              Gérer les chauffeurs
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-all">
              Voir les rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
