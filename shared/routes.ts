import { z } from 'zod';
import { insertModelSchema, models, metrics, healingActions } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  models: {
    list: {
      method: 'GET' as const,
      path: '/api/models' as const,
      responses: {
        200: z.array(z.custom<typeof models.$inferSelect>()),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/models/:id' as const,
      input: insertModelSchema.partial(),
      responses: {
        200: z.custom<typeof models.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    }
  },
  metrics: {
    list: {
      method: 'GET' as const,
      path: '/api/models/:modelId/metrics' as const,
      responses: {
        200: z.array(z.custom<typeof metrics.$inferSelect>()),
      }
    }
  },
  healingActions: {
    list: {
      method: 'GET' as const,
      path: '/api/healing-actions' as const,
      responses: {
        200: z.array(z.custom<typeof healingActions.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}