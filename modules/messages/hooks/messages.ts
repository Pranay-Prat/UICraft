import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
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
      // Poll if no data yet (waiting for initial load)
      if (!data || data.length === 0) {
        return 2000;
      }
      // Poll if last message is from user (waiting for assistant response)
      const lastMessage = data[data.length - 1];
      return lastMessage?.role === "USER" ? 2000 : false;
    },
  });
};

export const useCreateMessages = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: string) => createMessages(value, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", "status"],
      });
    },
  });
};
