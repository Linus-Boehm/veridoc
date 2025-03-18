import type { AppRouter } from '@taxel/api-client/src/client-types';
import { useAuth } from '@repo/auth/client';
import { hc } from 'hono/client';
import { keys } from '#keys.ts';

export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiClient = hc<AppRouter>(keys().NEXT_PUBLIC_API_URL, {
    headers: async () => {
      const token = await getToken();

      return {
        Authorization: `Bearer ${token}`,
        Origin: keys().NEXT_PUBLIC_APP_URL,
      };
    },
  });
  return apiClient;
};