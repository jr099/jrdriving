import { Building2, User, Zap, MapPin, Clock, ArrowRight } from 'lucide-react';

type ServicesProps = {
  onNavigate: (page: string) => void;
};

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des solutions de convoyage automobile sur mesure pour professionnels et particuliers
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
                <Building2 className="h-16 w-16 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Convoyage B2B</h2>
                <p className="text-blue-100">Solutions professionnelles pour entreprises</p>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Nos clients professionnels</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Loueurs de véhicules</h4>
                      <p className="text-gray-600">Repositionnement de flotte, convoyage one-way, gestion multi-sites</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Concessions automobiles</h4>
                      <p className="text-gray-600">Transferts inter-agences, livraisons clients, retours SAV</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Garages et ateliers</h4>
                      <p className="text-gray-600">Véhicules de courtoisie, récupération après réparation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Flottes d'entreprise</h4>
                      <p className="text-gray-600">Gestion de parc, remplacement de véhicules</p>
                    </div>
                  </li>
                </ul>
                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Avantages B2B</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                      Tarifs négociés pour volumes
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                      Facturation mensuelle
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                      Interlocuteur dédié
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                      Suivi en temps réel
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('quote')}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Demander un devis B2B
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 text-white">
                <User className="h-16 w-16 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Convoyage B2C</h2>
                <p className="text-orange-100">Services personnalisés pour particuliers</p>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Nos services particuliers</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Achat à distance</h4>
                      <p className="text-gray-600">Rapatriement de véhicule acheté partout en France</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Déménagement</h4>
                      <p className="text-gray-600">Transport de votre véhicule lors d'un déménagement</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Panne ou accident</h4>
                      <p className="text-gray-600">Rapatriement de véhicule immobilisé</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">Livraison garage</h4>
                      <p className="text-gray-600">Convoyage vers un atelier éloigné</p>
                    </div>
                  </li>
                </ul>
                <div className="bg-orange-50 p-6 rounded-xl mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Avantages B2C</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-orange-600 mr-2" />
                      Devis gratuit et rapide
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-orange-600 mr-2" />
                      Paiement sécurisé en ligne
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-orange-600 mr-2" />
                      Suivi de mission en direct
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-orange-600 mr-2" />
                      Assurance tous risques
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('quote')}
                  className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Demander un devis particulier
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200">
              <div className="flex items-center mb-6">
                <div className="bg-orange-600 p-3 rounded-full">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 ml-4">Convoyage Express</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Besoin urgent de transporter un véhicule? Notre service express garantit une prise en charge dans les 4h et une livraison prioritaire.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-orange-600 mr-2" />
                  Prise en charge sous 4h
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 text-orange-600 mr-2" />
                  Livraison prioritaire
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-orange-600 mr-2" />
                  Disponible 7j/7
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-3 rounded-full">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 ml-4">Multi-étapes</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Optimisez vos coûts avec notre service multi-étapes. Transport de plusieurs véhicules sur un même trajet avec des arrêts intermédiaires.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                  Tarifs optimisés
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                  Flexibilité des horaires
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                  Planification sur mesure
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Une question sur nos services?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Notre équipe est à votre disposition pour vous conseiller
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('quote')}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Demander un devis
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white text-slate-900 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
