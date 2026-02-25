import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  status: text("status").notNull(), // 'running', 'paused', 'crashed', 'overloaded'
  currentLatency: integer("current_latency").notNull().default(0),
  currentMemory: integer("current_memory").notNull().default(0),
  currentNpu: integer("current_npu").notNull().default(0),
  targetLatency: integer("target_latency").notNull().default(100),
  targetMemory: integer("target_memory").notNull().default(80),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  latency: integer("latency").notNull(),
  memory: integer("memory").notNull(),
  npu: integer("npu").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const healingActions = pgTable("healing_actions", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  action: text("action").notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertModelSchema = createInsertSchema(models).omit({ id: true, lastUpdated: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export const insertHealingActionSchema = createInsertSchema(healingActions).omit({ id: true, timestamp: true });

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type HealingAction = typeof healingActions.$inferSelect;
export type InsertHealingAction = z.infer<typeof insertHealingActionSchema>;

export type UpdateModelRequest = Partial<InsertModel>;