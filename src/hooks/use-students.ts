import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertUser, type User } from "@shared/routes";

export function useStudents() {
  return useQuery<User[]>({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await fetch(api.students.list.path);
      if (!res.ok) throw new Error("Failed to fetch students");
      return await res.json();
    },
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.students.create.path, {
        method: api.students.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create student");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertUser>) => {
      const url = buildUrl(api.students.update.path, { id });
      const res = await fetch(url, {
        method: api.students.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update student");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.students.delete.path, { id });
      const res = await fetch(url, { method: api.students.delete.method });
      if (!res.ok) throw new Error("Failed to delete student");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
    },
  });
}
