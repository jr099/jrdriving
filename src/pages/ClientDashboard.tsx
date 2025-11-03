import { useLoaderData } from 'react-router-dom';
import type { AuthSession } from '../lib/auth';
import { Calendar, ClipboardList, LogIn } from 'lucide-react';

export default function ClientDashboard() {
  const { profile } = useLoaderData() as AuthSession;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Bienvenue {profile.fullName}</h1>
          <p className="text-lg text-gray-600">
            Suivez vos demandes de devis, missions planifiées et factures depuis cet espace sécurisé.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Demandes de devis</h2>
            <p className="text-sm text-gray-600">
              Retrouvez l&apos;historique de vos demandes, leurs statuts et les réponses de nos équipes.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Missions planifiées</h2>
            <p className="text-sm text-gray-600">
              Visualisez les dates clés de convoyage et accédez aux détails logistiques de chaque mission.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Accès rapide</h2>
            <p className="text-sm text-gray-600">
              Connectez-vous depuis n&apos;importe quel appareil pour suivre l&apos;exécution et télécharger vos documents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
