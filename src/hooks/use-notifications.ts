import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertNotification, type Notification } from "@shared/routes";

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: [api.notifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.notifications.list.path);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return await res.json();
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertNotification) => {
      const res = await fetch(api.notifications.create.path, {
        method: api.notifications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send notification");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notifications.list.path] });
    },
  });
}
