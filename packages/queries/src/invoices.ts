'use client';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '#src/api.ts';

const queryKeys = {
  DEFAULT: 'invoices',
  list: () => [queryKeys.DEFAULT],
  get: (invoiceId: string) => [queryKeys.DEFAULT, invoiceId],
} as const;

export const useInvoices = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.list(),
    queryFn: async () => {
      const response = await apiClient.invoices.$get({});
      return response.json();
    },
  });
};

export const useInvoice = (invoiceId: string) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.get(invoiceId),
    queryFn: async () => {
      const response = await apiClient.invoices[':invoiceId'].$get({
        param: {
          invoiceId,
        },
      });
      return response.json();
    },
  });
};
