import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMenu, type MenuItem } from "@shared/routes";

export function useMenu() {
  return useQuery<MenuItem[]>({
    queryKey: [api.menu.list.path],
    queryFn: async () => {
      const res = await fetch(api.menu.list.path);
      if (!res.ok) throw new Error("Failed to fetch menu");
      return await res.json();
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMenu) => {
      const res = await fetch(api.menu.update.path, {
        method: api.menu.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update menu");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.menu.list.path] });
    },
  });
}
