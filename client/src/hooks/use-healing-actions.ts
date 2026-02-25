import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    return data as T;
  }
  return result.data;
}

export function useHealingActions() {
  return useQuery({
    queryKey: [api.healingActions.list.path],
    queryFn: async () => {
      const res = await fetch(api.healingActions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch healing actions");
      const data = await res.json();
      return parseWithLogging(api.healingActions.list.responses[200], data, "healingActions.list");
    },
    refetchInterval: 2000,
  });
}
