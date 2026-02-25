import { db } from "./db";
import {
  models, metrics, healingActions,
  type Model, type Metric, type HealingAction,
  type InsertModel, type InsertMetric, type InsertHealingAction,
  type UpdateModelRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getModels(): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  updateModel(id: number, updates: UpdateModelRequest): Promise<Model>;
  
  getMetrics(modelId: number, limit?: number): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  getHealingActions(limit?: number): Promise<HealingAction[]>;
  createHealingAction(action: InsertHealingAction): Promise<HealingAction>;
}

export class DatabaseStorage implements IStorage {
  async getModels(): Promise<Model[]> {
    return await db.select().from(models).orderBy(models.id);
  }

  async getModel(id: number): Promise<Model | undefined> {
    const [model] = await db.select().from(models).where(eq(models.id, id));
    return model;
  }

  async createModel(model: InsertModel): Promise<Model> {
    const [newModel] = await db.insert(models).values(model).returning();
    return newModel;
  }

  async updateModel(id: number, updates: UpdateModelRequest): Promise<Model> {
    const [updated] = await db.update(models)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(models.id, id))
      .returning();
    return updated;
  }

  async getMetrics(modelId: number, limit: number = 30): Promise<Metric[]> {
    const data = await db.select()
      .from(metrics)
      .where(eq(metrics.modelId, modelId))
      .orderBy(desc(metrics.timestamp))
      .limit(limit);
    return data.reverse(); // Return in chronological order for charts
  }

  async createMetric(metric: InsertMetric): Promise<Metric> {
    const [newMetric] = await db.insert(metrics).values(metric).returning();
    return newMetric;
  }

  async getHealingActions(limit: number = 20): Promise<HealingAction[]> {
    return await db.select()
      .from(healingActions)
      .orderBy(desc(healingActions.timestamp))
      .limit(limit);
  }

  async createHealingAction(action: InsertHealingAction): Promise<HealingAction> {
    const [newAction] = await db.insert(healingActions).values(action).returning();
    return newAction;
  }
}

export const storage = new DatabaseStorage();