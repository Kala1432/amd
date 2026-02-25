import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    return data as T;
  }
  return result.data;
}

export function useMetrics(modelId: number) {
  return useQuery({
    queryKey: [api.metrics.list.path, modelId],
    queryFn: async () => {
      const url = buildUrl(api.metrics.list.path, { modelId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const data = await res.json();
      return parseWithLogging(api.metrics.list.responses[200], data, "metrics.list");
    },
    refetchInterval: 2000,
    enabled: !!modelId,
  });
}
