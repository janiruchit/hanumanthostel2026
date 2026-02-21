import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertRent, type RentRecord } from "@shared/routes";

export function useRentRecords() {
  return useQuery<RentRecord[]>({
    queryKey: [api.rent.list.path],
    queryFn: async () => {
      const res = await fetch(api.rent.list.path);
      if (!res.ok) throw new Error("Failed to fetch rent records");
      return await res.json();
    },
  });
}

export function useCreateRent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertRent) => {
      const res = await fetch(api.rent.create.path, {
        method: api.rent.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create rent record");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.rent.list.path] });
    },
  });
}

export function useMarkRentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.rent.markPaid.path, { id });
      const res = await fetch(url, { method: api.rent.markPaid.method });
      if (!res.ok) throw new Error("Failed to mark rent as paid");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.rent.list.path] });
    },
  });
}
