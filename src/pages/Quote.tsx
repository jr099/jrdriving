import { useCallback, useState } from 'react';
import { Truck, Calendar, MapPin, Upload, CheckCircle, FileText, Trash2 } from 'lucide-react';
import { submitQuote } from '../lib/api';
import { extractErrorMessage } from '../lib/api-client';
import type { QuoteAttachmentPayload } from '../lib/api-types';

type QuoteProps = {
  onNavigate: (page: string) => void;
};

export default function Quote({ onNavigate }: QuoteProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    vehicleType: '',
    departureLocation: '',
    arrivalLocation: '',
    preferredDate: '',
    message: '',
  });

  const [attachments, setAttachments] = useState<QuoteAttachmentPayload[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toBase64 = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',').pop() ?? '';
          resolve(base64);
        } else {
          reject(new Error('Impossible de lire le fichier.'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Impossible de lire le fichier.'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const nextFiles: QuoteAttachmentPayload[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`Le fichier ${file.name} dépasse la taille maximale autorisée (5 Mo).`);
        continue;
      }

      const base64 = await toBase64(file);
      nextFiles.push({ name: file.name, type: file.type, size: file.size, data: base64 });
    }

    setAttachments((prev) => [...prev, ...nextFiles]);
    event.target.value = '';
  }, [toBase64]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitQuote({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName || undefined,
        vehicleType: formData.vehicleType,
        departureLocation: formData.departureLocation,
        arrivalLocation: formData.arrivalLocation,
        preferredDate: formData.preferredDate || undefined,
        message: formData.message || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting quote:', err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Demande de devis envoyée!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre demande. Notre équipe va l'étudier et vous contactera dans les plus brefs délais pour vous proposer un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  companyName: '',
                  vehicleType: '',
                  departureLocation: '',
                  arrivalLocation: '',
                  preferredDate: '',
                  message: '',
                });
                setAttachments([]);
              }}
              className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Truck className="h-16 w-16 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Demander un devis
          </h1>
          <p className="text-xl text-gray-600">
            Remplissez le formulaire ci-dessous et recevez une estimation personnalisée
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Société (optionnel)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Type de véhicule <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un type</option>
                <option value="sedan">Berline</option>
                <option value="suv">SUV</option>
                <option value="van">Utilitaire</option>
                <option value="luxury">Véhicule de luxe</option>
                <option value="motorcycle">Moto</option>
                <option value="truck">Camion</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Lieu de départ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="departureLocation"
                  value={formData.departureLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ville ou adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Lieu d'arrivée <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="arrivalLocation"
                  value={formData.arrivalLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ville ou adresse complète"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date souhaitée (optionnel)
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Informations complémentaires
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Détails supplémentaires, besoins spécifiques..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Upload className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Documents</h4>
                  <p className="text-sm text-gray-600">
                    Vous pourrez joindre des documents (carte grise, photos, etc.) après validation de votre demande.
                  </p>
                  <div className="mt-4">
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-lg py-6 cursor-pointer hover:border-blue-500 transition-colors">
                      <Upload className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm text-blue-700 font-semibold">Importer des fichiers (max 5 Mo)</span>
                      <input type="file" className="hidden" multiple onChange={handleFileChange} />
                    </label>
                    {attachments.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-4 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} Ko</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-700"
                              aria-label={`Supprimer ${file.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande de devis'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              En envoyant ce formulaire, vous acceptez d'être contacté par notre équipe concernant votre demande.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
