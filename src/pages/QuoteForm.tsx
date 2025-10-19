import { useEffect, useMemo, useState, type InputHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createQuote } from '../api/quotes';
import { useAuth } from '../contexts/AuthContext';
import { quoteFormSchema, type QuoteFormValues } from './quoteForm.schema';

type QuoteFormProps = {
  onNavigate: (page: string) => void;
};

export default function QuoteForm({ onNavigate: _onNavigate }: QuoteFormProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultValues = useMemo<QuoteFormValues>(
    () => ({
      fullName: profile?.full_name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      companyName: profile?.company_name ?? undefined,
      vehicleType: '',
      departureLocation: '',
      arrivalLocation: '',
      preferredDate: '',
      message: '',
    }),
    [profile]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationKey: ['quotes', 'create'],
    mutationFn: async (values: QuoteFormValues) =>
      createQuote({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        companyName: values.companyName ?? null,
        vehicleType: values.vehicleType,
        departureLocation: values.departureLocation,
        arrivalLocation: values.arrivalLocation,
        preferredDate: values.preferredDate ? values.preferredDate : null,
        message: values.message ?? null,
        profileId: profile?.id ?? null,
      }),
    onSuccess: () => {
      setShowSuccess(true);
      reset(defaultValues);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        navigate('/');
      }, 2400);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isSuccess, navigate]);

  const onSubmit: SubmitHandler<QuoteFormValues> = (values) => {
    mutate(values);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center mb-6" role="status" aria-live="polite">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Demande de devis envoyée !</h2>
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre demande. Notre équipe va l'étudier et vous contactera rapidement avec une proposition
            personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                reset(defaultValues);
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
            <Truck className="h-16 w-16 text-orange-600" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Demander un devis</h1>
          <p className="text-xl text-gray-600">
            Remplissez le formulaire ci-dessous pour recevoir une estimation personnalisée.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {isError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                Une erreur est survenue lors de l'envoi. Merci de réessayer.
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nom complet"
                required
                error={errors.fullName?.message}
                inputProps={{
                  id: 'fullName',
                  placeholder: 'Jean Dupont',
                  autoComplete: 'name',
                  ...register('fullName'),
                }}
              />
              <FormField
                label="Email"
                required
                error={errors.email?.message}
                inputProps={{
                  id: 'email',
                  type: 'email',
                  placeholder: 'jean.dupont@email.com',
                  autoComplete: 'email',
                  ...register('email'),
                }}
              />
              <FormField
                label="Téléphone"
                required
                error={errors.phone?.message}
                inputProps={{
                  id: 'phone',
                  type: 'tel',
                  placeholder: '+33 6 12 34 56 78',
                  autoComplete: 'tel',
                  ...register('phone'),
                }}
              />
              <FormField
                label="Société"
                error={errors.companyName?.message}
                inputProps={{
                  id: 'companyName',
                  placeholder: "Nom de votre entreprise",
                  ...register('companyName'),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="vehicleType">
                Type de véhicule <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicleType"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                aria-invalid={Boolean(errors.vehicleType)}
                {...register('vehicleType')}
              >
                <option value="">Sélectionnez un type</option>
                <option value="berline">Berline</option>
                <option value="suv">SUV</option>
                <option value="utilitaire">Utilitaire</option>
                <option value="luxe">Haut de gamme</option>
                <option value="autre">Autre</option>
              </select>
              {errors.vehicleType ? (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.vehicleType.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Lieu de départ"
                required
                error={errors.departureLocation?.message}
                inputProps={{
                  id: 'departureLocation',
                  placeholder: 'Adresse ou ville de départ',
                  ...register('departureLocation'),
                }}
              />
              <FormField
                label="Lieu d'arrivée"
                required
                error={errors.arrivalLocation?.message}
                inputProps={{
                  id: 'arrivalLocation',
                  placeholder: "Adresse ou ville d'arrivée",
                  ...register('arrivalLocation'),
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Date souhaitée"
                error={errors.preferredDate?.message}
                inputProps={{
                  id: 'preferredDate',
                  type: 'date',
                  ...register('preferredDate'),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="message">
                Informations complémentaires
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Précisez les contraintes horaires, les accès spécifiques, etc."
                aria-invalid={Boolean(errors.message)}
                {...register('message')}
              />
              {errors.message ? (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.message.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma demande'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

function FormField({ label, required, error, inputProps }: FormFieldProps) {
  const { id } = inputProps;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor={id}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        {...inputProps}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      {error ? (
        <p id={describedBy} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
