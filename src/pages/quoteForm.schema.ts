import { z, type infer as Infer } from 'zod';

export const quoteFormSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email("L'adresse e-mail est invalide."),
  phone: z
    .string()
    .min(6, 'Le numéro de téléphone est trop court.')
    .max(30, 'Le numéro de téléphone est trop long.'),
  companyName: z
    .string()
    .max(120, "Le nom de l'entreprise est trop long.")
    .optional(),
  vehicleType: z.string().min(1, 'Sélectionnez un type de véhicule.'),
  departureLocation: z.string().min(2, 'Indiquez le lieu de départ.'),
  arrivalLocation: z.string().min(2, "Indiquez le lieu d'arrivée."),
  preferredDate: z.string().optional(),
  message: z
    .string()
    .max(500, 'Le message ne peut pas dépasser 500 caractères.')
    .optional(),
});

export type QuoteFormValues = Infer<typeof quoteFormSchema>;
