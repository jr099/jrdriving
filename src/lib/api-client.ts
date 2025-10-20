import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof (error.response.data as any).message === 'string'
        ? (error.response.data as any).message
        : undefined) ?? error.message ?? 'Une erreur est survenue'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue';
}
