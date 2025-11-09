import { useEffect, useState, type ReactNode } from 'react';
import { Users, Truck, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { fetchAdminDashboard } from '../lib/api';
import type { DriverApplication, Mission, Quote } from '../lib/api-types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMissions: 0,
    activeMissions: 0,
    totalDrivers: 0,
    totalClients: 0,
    pendingQuotes: 0,
    revenue: 0,
    punctualityRate: 100,
  });
  const [recentMissions, setRecentMissions] = useState<Mission[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<Quote[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { stats: dashboardStats, recentMissions, pendingQuotes, driverApplications, aiInsights } =
          await fetchAdminDashboard();
        setStats(dashboardStats);
        setRecentMissions(recentMissions);
        setPendingQuotes(pendingQuotes);
        setDriverApplications(driverApplications);
        setAiInsights(aiInsights);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          <StatCard title="Total missions" value={`${stats.totalMissions}`} subtitle={`${stats.activeMissions} actives`} icon={<Truck className="h-12 w-12 text-blue-600" />} />
          <StatCard title="Chauffeurs" value={`${stats.totalDrivers}`} icon={<Users className="h-12 w-12 text-green-600" />} />
          <StatCard title="Clients" value={`${stats.totalClients}`} icon={<Users className="h-12 w-12 text-orange-600" />} />
          <StatCard title="Devis en attente" value={`${stats.pendingQuotes}`} icon={<FileText className="h-12 w-12 text-yellow-600" />} valueClass="text-yellow-600" />
          <StatCard title="Chiffre d'affaires" value={`${stats.revenue.toFixed(0)} €`} icon={<DollarSign className="h-12 w-12 text-green-600" />} valueClass="text-green-600" />
          <StatCard
            title="Ponctualité"
            value={`${stats.punctualityRate}%`}
            subtitle="missions livrées dans les délais"
            icon={<TrendingUp className="h-12 w-12 text-blue-600" />}
            valueClass="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">Missions récentes</h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {recentMissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Aucune mission</div>
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
                <div className="p-6 text-center text-gray-500">Aucun devis en attente</div>
              ) : (
                pendingQuotes.map((quote) => (
                  <div key={quote.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{quote.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{quote.departureLocation} → {quote.arrivalLocation}</p>
                      <p className="text-xs">Type: {quote.vehicleType}</p>
                      {quote.companyName && <p className="text-xs text-blue-600">{quote.companyName}</p>}
                      {quote.attachments && quote.attachments.length > 0 && (
                        <div className="pt-2 space-y-1 text-xs">
                          {quote.attachments.map((file) => (
                            <a
                              key={file.id}
                              href={`/api/quotes/${quote.id}/attachments/${file.id}`}
                              className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              {file.fileName}
                              <span className="text-gray-400">({(file.fileSize / 1024).toFixed(0)} Ko)</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">Candidatures chauffeurs</h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {driverApplications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Aucune nouvelle candidature</div>
              ) : (
                driverApplications.map((application) => (
                  <div key={application.id} className="p-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{application.fullName}</p>
                        <p className="text-xs text-gray-500">{application.email} · {application.phone}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Expérience: {application.yearsExperience} ans</p>
                      <p>Permis: {application.licenseTypes.join(', ')}</p>
                      <p>Zones: {application.regions.join(', ')}</p>
                    </div>
                    {application.attachments.length > 0 && (
                      <div className="mt-3 space-y-1 text-xs">
                        {application.attachments.map((file) => (
                          <a
                            key={file.id}
                            href={`/api/recruitment/applications/${application.id}/attachments/${file.id}`}
                            className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            {file.fileName}
                            <span className="text-gray-400">({(file.fileSize / 1024).toFixed(0)} Ko)</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Insights IA</h2>
            <ul className="space-y-3 text-sm">
              {aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white"></span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white">
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

function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueClass,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueClass ?? 'text-slate-900'}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
}
