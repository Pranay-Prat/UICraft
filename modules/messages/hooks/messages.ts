import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { createMessages, getMessages } from "../actions";

export const prefetchMessages = async (
  queryClient: QueryClient,
  projectId: string
): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
  });
};

export const useGetMessages = (projectId: string) => {
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
    refetchInterval: (query) => {
      const data = query.state.data;
      
      return data?.length ? 2000 : false; 
    },
  });
};

export const useCreateMessages = (projectId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (value:string) => createMessages(value, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", projectId],
      });
    },
  });
};