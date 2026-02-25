import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Helper to log Zod errors but prevent UI crashes if backend sends dates as strings
function parseWithLogging<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // In lite mode, we return the raw data casted as T so the UI doesn't completely break
    return data as T;
  }
  return result.data;
}

export function useModels() {
  return useQuery({
    queryKey: [api.models.list.path],
    queryFn: async () => {
      const res = await fetch(api.models.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      return parseWithLogging(api.models.list.responses[200], data, "models.list");
    },
    refetchInterval: 2000, // Poll every 2 seconds for real-time feel
  });
}

export function useModel(id: number) {
  // We extract a single model from the list cache to avoid a dedicated endpoint if it doesn't exist
  const { data: models, isLoading } = useModels();
  return {
    data: models?.find((m) => m.id === id),
    isLoading,
  };
}

export function useUpdateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; status?: string; priority?: string }) => {
      const url = buildUrl(api.models.update.path, { id });
      const res = await fetch(url, {
        method: api.models.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update model");
      const data = await res.json();
      return parseWithLogging(api.models.update.responses[200], data, "models.update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.models.list.path] });
    },
  });
}
