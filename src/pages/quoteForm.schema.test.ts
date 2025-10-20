import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { quoteFormSchema } from './quoteForm.schema';

describe('quoteFormSchema', () => {
  it('accepts valid data', () => {
    const result = quoteFormSchema.safeParse({
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33612345678',
      companyName: 'Garage JD',
      vehicleType: 'berline',
      departureLocation: 'Paris',
      arrivalLocation: 'Lyon',
      preferredDate: '2025-01-01',
      message: 'Merci pour votre retour rapide.',
    });

    assert.equal(result.success, true);
  });

  it('rejects invalid email', () => {
    const result = quoteFormSchema.safeParse({
      fullName: 'Jean Dupont',
      email: 'not-an-email',
      phone: '+33612345678',
      vehicleType: 'berline',
      departureLocation: 'Paris',
      arrivalLocation: 'Lyon',
      preferredDate: '2025-01-01',
    });

    assert.equal(result.success, false);
  });

  it('rejects phone number that is too short', () => {
    const result = quoteFormSchema.safeParse({
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '1',
      vehicleType: 'berline',
      departureLocation: 'Paris',
      arrivalLocation: 'Lyon',
    });

    assert.equal(result.success, false);
  });
});
