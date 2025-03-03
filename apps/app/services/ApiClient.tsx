import type { AppRouter } from '@repo/api-client/src/client-types';
import { useAuth } from '@repo/auth/client';
import { hc } from 'hono/client';
import { env } from '#env.ts';

export const ApiClient = hc<AppRouter>(env.NEXT_PUBLIC_API_URL);

export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiClient = hc<AppRouter>(env.NEXT_PUBLIC_API_URL, {
    headers: async () => {
      const token = await getToken();

      return {
        Authorization: `Bearer ${token}`,
        Origin: env.NEXT_PUBLIC_APP_URL,
      };
    },
  });
  return apiClient;
};
