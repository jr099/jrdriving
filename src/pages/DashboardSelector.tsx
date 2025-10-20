import { ShieldCheck, SteeringWheel, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ProfileRole } from '../types/domain';
import { usePageNavigation } from '../hooks/usePageNavigation';

const DASHBOARD_CARDS: Array<{
  role: ProfileRole;
  page: 'client' | 'driver' | 'admin';
  title: string;
  description: string;
  icon: typeof Users;
  accent: string;
}> = [
  {
    role: 'client',
    page: 'client',
    title: 'Espace client',
    description: 'Suivez vos demandes, devis, missions et factures en un clin d\'œil.',
    icon: Users,
    accent: 'bg-blue-100 text-blue-600',
  },
  {
    role: 'driver',
    page: 'driver',
    title: 'Tableau de bord chauffeur',
    description: 'Consultez vos missions, déclarez vos statuts et chargez vos preuves.',
    icon: SteeringWheel,
    accent: 'bg-green-100 text-green-600',
  },
  {
    role: 'admin',
    page: 'admin',
    title: 'Console d\'administration',
    description: 'Pilotez les opérations : missions, chauffeurs, clients et facturation.',
    icon: ShieldCheck,
    accent: 'bg-orange-100 text-orange-600',
  },
];

export default function DashboardSelector() {
  const { profile } = useAuth();
  const navigate = usePageNavigation();

  const accessibleRoles = useMemo(() => {
    if (!profile) {
      return new Set<ProfileRole>();
    }

    return new Set<ProfileRole>([profile.role]);
  }, [profile]);

  const greetingName = profile?.full_name?.trim();

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-700">Profil utilisateur introuvable</div>
          <p className="mt-2 text-sm text-slate-500">
            Veuillez actualiser la page ou vous reconnecter pour accéder à vos tableaux de bord.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Choisissez votre tableau de bord
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Bienvenue{greetingName ? `, ${greetingName}` : ''}! Sélectionnez l\'espace correspondant à votre rôle pour continuer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DASHBOARD_CARDS.map(({ role, page, title, description, icon: Icon, accent }) => {
            const isAccessible = accessibleRoles.has(role);

            return (
              <button
                key={role}
                type="button"
                onClick={() => isAccessible && navigate(page)}
                disabled={!isAccessible}
                aria-disabled={!isAccessible}
                className={`flex flex-col items-start rounded-2xl border border-slate-200 p-6 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                  isAccessible
                    ? 'bg-white hover:shadow-lg'
                    : 'bg-slate-50 text-slate-400 border-dashed cursor-not-allowed'
                }`}
              >
                <span
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    isAccessible ? accent : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className={`text-xl font-semibold ${isAccessible ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h2>
                <p className="mt-3 text-sm leading-relaxed">{description}</p>
                {!isAccessible && (
                  <span className="mt-6 inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                    Réservé aux comptes {role === 'driver' ? 'chauffeurs' : role === 'client' ? 'clients' : 'administrateurs'}
                  </span>
                )}
                {isAccessible && (
                  <span className="mt-6 inline-flex items-center text-sm font-semibold text-orange-600">
                    Accéder à l\'espace
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
