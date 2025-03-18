import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./api";
import type { CreatePostbox } from '@taxel/domain/src/postbox';

const queryKeys = {
  ROOT: 'postboxes',
  list: () => [queryKeys.ROOT],
  get: (postboxId: string) => [queryKeys.ROOT, { id: postboxId }],
} as const;

export const usePostboxes = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['postboxes'],
    queryFn: async () => {
      const data = await apiClient.postboxes.$get();
      return data.json();
    },
  });
};

export const createPostbox = (postbox: CreatePostbox) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.postboxes.$post({ json: postbox }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list() });
    },
  });
};
