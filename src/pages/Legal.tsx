export default function Legal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-xl text-gray-300">Informations légales de jrdriving</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Éditeur du site</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Raison sociale:</strong> jrdriving - Galaxj Air Digital<br />
                <strong>Siège social:</strong> Paris, France<br />
                <strong>Email:</strong> contact@jrdriving.galaxjr.digital<br />
                <strong>Téléphone:</strong> +33 1 23 45 67 89
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Directeur de la publication</h2>
              <p className="text-gray-700 leading-relaxed">
                Le directeur de la publication est le représentant légal de jrdriving.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Hébergement</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Hébergeur:</strong> Supabase Inc.<br />
                <strong>Adresse:</strong> 970 Toa Payoh North, #07-04, Singapore 318992
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
              <p className="text-gray-700 leading-relaxed">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Données personnelles</h2>
              <p className="text-gray-700 leading-relaxed">
                Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à la gestion des demandes de devis et des services de convoyage. Conformément à la loi "informatique et libertés" du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données qui vous concernent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation de responsabilité</h2>
              <p className="text-gray-700 leading-relaxed">
                jrdriving ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Droit applicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
