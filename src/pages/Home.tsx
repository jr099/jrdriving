import { Truck, Clock, Shield, Award, Star, ArrowRight } from 'lucide-react';

type HomeProps = {
  onNavigate: (page: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Truck className="h-20 w-20 text-orange-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              jrdriving
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-4 text-gray-200">
              Votre partenaire logistique pour le transport
            </p>
            <p className="text-xl md:text-2xl mb-8 text-orange-400">
              rapide et sécurisé de vos véhicules
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <button
                onClick={() => onNavigate('quote')}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
              >
                Demander un devis
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="px-8 py-4 bg-white text-slate-900 hover:bg-gray-100 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Découvrir nos services
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir jrdriving?
            </h2>
            <p className="text-xl text-gray-600">
              Des solutions de convoyage professionnelles adaptées à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rapidité</h3>
              <p className="text-gray-600">
                Convoyage express disponible 7j/7 avec une prise en charge sous 24h
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sécurité</h3>
              <p className="text-gray-600">
                Chauffeurs professionnels certifiés et véhicules assurés tous risques
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Qualité</h3>
              <p className="text-gray-600">
                Plus de 15 ans d'expérience dans le convoyage automobile professionnel
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Satisfaction</h3>
              <p className="text-gray-600">
                98% de clients satisfaits et un service client disponible 6j/7
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Nos clients nous font confiance
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Depuis plus de 15 ans, nous accompagnons les professionnels de l'automobile et les particuliers dans leurs besoins de convoyage.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-orange-600 rounded-full p-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-slate-900">Loueurs de véhicules</h4>
                    <p className="text-gray-600">Repositionnement de flotte partout en France</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-600 rounded-full p-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-slate-900">Concessions automobiles</h4>
                    <p className="text-gray-600">Transferts inter-agences et livraisons clients</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-600 rounded-full p-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-slate-900">Particuliers</h4>
                    <p className="text-gray-600">Déménagement, achat à distance, panne</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="mt-8 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                En savoir plus
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-orange-500 fill-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Service impeccable! Nos véhicules sont toujours livrés en temps et en heure. Une équipe professionnelle et réactive."
                </p>
                <p className="font-semibold text-slate-900">Pierre M.</p>
                <p className="text-sm text-gray-600">Directeur, Location Auto Premium</p>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-orange-500 fill-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "J'ai fait appel à jrdriving pour rapatrier ma voiture depuis le sud de la France. Excellent service, je recommande!"
                </p>
                <p className="font-semibold text-slate-900">Sophie L.</p>
                <p className="text-sm text-gray-600">Particulier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transporter votre véhicule?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Obtenez un devis gratuit en quelques minutes
          </p>
          <button
            onClick={() => onNavigate('quote')}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl inline-flex items-center"
          >
            Demander un devis gratuit
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
