'use client';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '#src/api.ts';

const queryKeys = {
  DEFAULT: 'inboundEmails',
  list: (includeArchived?: boolean) => [queryKeys.DEFAULT, { includeArchived }],
  get: (emailId: string, withDetails?: boolean) => [
    queryKeys.DEFAULT,
    emailId,
    { withDetails },
  ],
} as const;

export interface QueryOptions {
    enabled?: boolean
}

/**
 * Hook to fetch a list of inbound emails
 * @param includeArchived Whether to include archived emails in the results
 */
export const useInboundEmails = (includeArchived = false) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.list(includeArchived),
    queryFn: async () => {
      const response = await apiClient.inboundEmails.$get({
        query: {
          includeArchived: includeArchived ? 'true' : 'false',
        },
      });
      return response.json();
    },
  });
};

/**
 * Hook to fetch a single inbound email by ID
 * @param emailId The ID of the email to fetch
 * @param withDetails Whether to include the email body in the response
 */
export const useInboundEmail = (
  emailId: string,
  withDetails = false,
  options: QueryOptions = {}
) => {
  const apiClient = useApiClient();
  return useQuery({
    ...options,
    queryKey: queryKeys.get(emailId, withDetails),
    queryFn: async () => {
      const response = await apiClient.inboundEmails[':emailId'].$get({
        param: {
          emailId,
        },
        query: {
          withDetails: withDetails ? 'true' : 'false',
        },
      });
      return response.json();
    },
  });
};

/**
 * Hook to archive an inbound email
 */
export const useArchiveInboundEmail = () => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      const response = await apiClient.inboundEmails[':emailId'].archive.$post({
        param: {
          emailId,
        },
      });
      return response.json();
    },
    onSuccess: (data, emailId) => {
      // Invalidate the specific email query
      queryClient.invalidateQueries({
        queryKey: queryKeys.get(emailId),
      });

      // Invalidate the list query to update the list
      queryClient.invalidateQueries({
        queryKey: queryKeys.list(),
      });
    },
  });
};
