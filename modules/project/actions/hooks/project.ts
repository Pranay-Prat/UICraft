import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createProject,getProjectById,getProjects } from "..";
export const useGetProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
}
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
export const useGetProjectById = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId),
    })
}