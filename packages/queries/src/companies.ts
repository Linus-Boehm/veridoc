'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '#src/api.ts';

const queryKeys = {
  DEFAULT: 'companies',
  list: () => [queryKeys.DEFAULT],
  get: (companyId: string) => [queryKeys.DEFAULT, companyId],
} as const;

export const useCompanies = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.list(),
    queryFn: async () => {
      const response = await apiClient.companies.$get({});
      return response.json();
    },
  });
};

export const useCompany = (companyId: string) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.get(companyId),
    queryFn: async () => {
      const response = await apiClient.companies[':companyId'].$get({
        param: {
          companyId,
        },
      });
      return response.json();
    },
  });
};

export interface CreateCompanyInput {
  name: string;
  countryCode: string;
  vatId?: string;
  industryId?: string;
  ext_vendor_number?: string;
  addresses?: {
    addressName?: string;
    addressLine1: string;
    addressLine2?: string;
    administrativeArea?: string;
    locality?: string;
    postalCode: string;
    countryCode: string;
    type: 'billing' | 'shipping' | 'headquarters' | 'branch' | 'other';
    isPrimary: boolean;
  }[];
  domains?: {
    domain: string;
    isPrimary: boolean;
    isVerified: boolean;
  }[];
}

export const useCreateCompany = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCompanyInput) => {
      const response = await apiClient.companies.$post({
        json: input,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list() });
    },
  });
};
