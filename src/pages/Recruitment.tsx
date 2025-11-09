import { useCallback, useState } from 'react';
import { Car, Award, MapPin, CheckCircle, Upload, FileText, Trash2 } from 'lucide-react';
import { submitDriverApplication } from '../lib/api';
import { extractErrorMessage } from '../lib/api-client';
import type { DriverApplicationPayload, QuoteAttachmentPayload } from '../lib/api-types';

const LICENCE_OPTIONS = ['Permis B', 'Permis BE', 'Permis C', 'Permis CE', 'Permis D'];
const REGION_OPTIONS = ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Provence-Alpes-Côte d’Azur', 'Hauts-de-France'];

export default function Recruitment() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    yearsExperience: '0',
    licenseTypes: [] as string[],
    regions: [] as string[],
    availability: '',
    hasOwnVehicle: 'true',
    hasCompany: 'false',
    message: '',
  });
  const [attachments, setAttachments] = useState<QuoteAttachmentPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toBase64 = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result.split(',').pop() ?? '');
        } else {
          reject(new Error('Impossible de lire le fichier.'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Impossible de lire le fichier.'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [toBase64]
  );

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArrayValue = (name: 'licenseTypes' | 'regions', value: string) => {
    setFormData((prev) => {
      const current = new Set(prev[name]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [name]: Array.from(current) };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const payload: DriverApplicationPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      yearsExperience: Number(formData.yearsExperience),
      licenseTypes: formData.licenseTypes,
      regions: formData.regions,
      availability: formData.availability,
      hasOwnVehicle: formData.hasOwnVehicle === 'true',
      hasCompany: formData.hasCompany === 'true',
      message: formData.message || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    try {
      await submitDriverApplication(payload);
      setSubmitted(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Candidature envoyée !</h2>
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre intérêt. Notre équipe RH analysera votre profil et vous recontactera rapidement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Car className="h-16 w-16 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Rejoignez l’équipe jrdriving</h1>
          <p className="text-lg text-gray-600">
            Devenez chauffeur professionnel et contribuez à la mobilité de nos clients partout en France.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
            <Award className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Missions régulières</h3>
              <p className="text-sm text-gray-600">
                Planification hebdomadaire, trajets inter-régions et primes pour missions express.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
            <MapPin className="h-10 w-10 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Couverture nationale</h3>
              <p className="text-sm text-gray-600">
                Des clients partout en France et des missions adaptées à votre zone de préférence.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
            <Car className="h-10 w-10 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Accompagnement complet</h3>
              <p className="text-sm text-gray-600">
                Support 24/7, outils digitaux, prise en charge des frais selon mission.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Votre candidature</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Nom complet *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="jean.dupont@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Années d’expérience *</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  min={0}
                  max={50}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-900 mb-2">Permis détenus *</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {LICENCE_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <input
                      type="checkbox"
                      checked={formData.licenseTypes.includes(option)}
                      onChange={() => toggleArrayValue('licenseTypes', option)}
                    />
                    <span className="text-sm text-slate-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-900 mb-2">Zones de préférence *</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {REGION_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <input
                      type="checkbox"
                      checked={formData.regions.includes(option)}
                      onChange={() => toggleArrayValue('regions', option)}
                    />
                    <span className="text-sm text-slate-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Disponibilités *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionnez une option</option>
                <option value="Temps plein">Temps plein</option>
                <option value="Partiel semaine">Partiel semaine</option>
                <option value="Week-end">Week-end</option>
                <option value="Mission ponctuelle">Mission ponctuelle</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="block text-sm font-semibold text-slate-900 mb-2">Disposez-vous d’un véhicule ? *</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasOwnVehicle"
                      value="true"
                      checked={formData.hasOwnVehicle === 'true'}
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">Oui</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasOwnVehicle"
                      value="false"
                      checked={formData.hasOwnVehicle === 'false'}
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">Non</span>
                  </label>
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-900 mb-2">Statut professionnel *</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasCompany"
                      value="true"
                      checked={formData.hasCompany === 'true'}
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">Indépendant / société</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasCompany"
                      value="false"
                      checked={formData.hasCompany === 'false'}
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">Salarié / disponible</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Présentation</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Précisez vos expériences, types de véhicules maîtrisés, attentes..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Upload className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">Documents</h4>
                  <p className="text-sm text-gray-600">
                    Ajoutez votre CV, attestations d’assurance ou autres justificatifs (PDF, JPG, PNG).
                  </p>
                  <label className="mt-4 flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-lg py-6 cursor-pointer hover:border-blue-500 transition-colors">
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

            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
