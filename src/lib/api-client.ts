import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return error.message ?? 'Une erreur est survenue';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue';
}
