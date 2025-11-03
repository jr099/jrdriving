export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Conditions Générales de Vente</h1>
          <p className="text-xl text-gray-300">Conditions applicables aux services jrdriving</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 1 - Objet</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre jrdriving et ses clients dans le cadre de services de convoyage automobile. Toute commande implique l'acceptation sans réserve des présentes CGV.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 2 - Services proposés</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                jrdriving propose les services suivants:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Convoyage automobile B2B pour professionnels</li>
                <li>Convoyage automobile B2C pour particuliers</li>
                <li>Service express avec prise en charge prioritaire</li>
                <li>Convoyage multi-étapes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 3 - Devis et commande</h2>
              <p className="text-gray-700 leading-relaxed">
                Toute demande de service commence par une demande de devis gratuite. Le devis est valable 30 jours à compter de sa date d'émission. La commande est ferme et définitive dès acceptation du devis par le client et versement de l'acompte si requis.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 4 - Prix et modalités de paiement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les prix sont indiqués en euros TTC. Ils incluent le convoyage du véhicule et l'assurance tous risques. Les modalités de paiement sont les suivantes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Particuliers: paiement intégral avant prestation</li>
                <li>Professionnels: facturation mensuelle possible sur demande</li>
                <li>Modes de paiement acceptés: carte bancaire, virement, chèque</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 5 - Exécution du service</h2>
              <p className="text-gray-700 leading-relaxed">
                Le véhicule sera pris en charge à la date et au lieu convenus. Un état des lieux contradictoire sera établi au départ et à l'arrivée. Le client sera informé de l'avancement de la mission en temps réel via son espace personnel.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 6 - Assurance et responsabilité</h2>
              <p className="text-gray-700 leading-relaxed">
                Tous nos véhicules sont assurés tous risques. jrdriving souscrit une assurance responsabilité civile professionnelle couvrant les dommages causés aux tiers et aux véhicules confiés. En cas de sinistre, le client sera informé immédiatement et une déclaration sera établie.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 7 - Annulation et modification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Toute annulation ou modification doit être notifiée par écrit:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Plus de 48h avant: annulation gratuite</li>
                <li>Entre 48h et 24h: 50% du montant facturé</li>
                <li>Moins de 24h: 100% du montant facturé</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 8 - Réclamations</h2>
              <p className="text-gray-700 leading-relaxed">
                Toute réclamation doit être adressée par écrit à jrdriving dans un délai de 7 jours suivant la fin de la prestation. jrdriving s'engage à répondre dans un délai de 15 jours ouvrés.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 9 - Protection des données</h2>
              <p className="text-gray-700 leading-relaxed">
                Les données personnelles collectées sont destinées à la gestion des services de convoyage. Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses données personnelles.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 10 - Droit applicable et litiges</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
