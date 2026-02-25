import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.models.list.path, async (req, res) => {
    const models = await storage.getModels();
    res.json(models);
  });

  app.put(api.models.update.path, async (req, res) => {
    try {
      const input = api.models.update.input.parse(req.body);
      const model = await storage.updateModel(Number(req.params.id), input);
      res.json(model);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.metrics.list.path, async (req, res) => {
    const data = await storage.getMetrics(Number(req.params.modelId));
    res.json(data);
  });

  app.get(api.healingActions.list.path, async (req, res) => {
    const actions = await storage.getHealingActions();
    res.json(actions);
  });

  // Start simulation loop asynchronously after a short delay
  setTimeout(() => {
    startSimulationLoop().catch(console.error);
  }, 2000);

  return httpServer;
}

async function seedDatabase() {
  const existingModels = await storage.getModels();
  if (existingModels.length === 0) {
    await storage.createModel({
      name: "YOLOv8 Object Detection",
      type: "Computer Vision",
      priority: "high",
      status: "running",
      currentLatency: 45,
      currentMemory: 40,
      currentNpu: 60,
      targetLatency: 100,
      targetMemory: 80
    });
    await storage.createModel({
      name: "Whisper Speech Recognition",
      type: "Audio Processing",
      priority: "medium",
      status: "running",
      currentLatency: 120,
      currentMemory: 65,
      currentNpu: 40,
      targetLatency: 200,
      targetMemory: 75
    });
    await storage.createModel({
      name: "Anomaly Detection",
      type: "Time Series",
      priority: "low",
      status: "running",
      currentLatency: 15,
      currentMemory: 20,
      currentNpu: 10,
      targetLatency: 50,
      targetMemory: 50
    });
  }
}

async function startSimulationLoop() {
  await seedDatabase();
  
  setInterval(async () => {
    try {
      const allModels = await storage.getModels();
      
      for (const m of allModels) {
        if (m.status === 'paused') continue;
        
        let newLatency = m.currentLatency;
        let newMemory = m.currentMemory;
        let newNpu = m.currentNpu;
        let newStatus = m.status;
        
        if (m.status === 'crashed') {
          await storage.createHealingAction({
            modelId: m.id,
            action: "Restart",
            reason: `Model ${m.name} crashed. Auto-restarting.`
          });
          newStatus = 'running';
          newLatency = 30;
          newMemory = 30;
          newNpu = 30;
        } else {
          newLatency = Math.max(10, m.currentLatency + (Math.random() * 40 - 15));
          newMemory = Math.max(10, Math.min(100, m.currentMemory + (Math.random() * 10 - 3)));
          newNpu = Math.max(10, Math.min(100, m.currentNpu + (Math.random() * 20 - 10)));
          
          if (Math.random() < 0.08) newLatency += 150; 
          if (Math.random() < 0.03) newStatus = 'crashed';
          
          if (newStatus !== 'crashed') {
            if (newLatency > m.targetLatency || newMemory > m.targetMemory) {
              newStatus = 'overloaded';
              if (m.priority === 'low') {
                 newStatus = 'paused';
                 await storage.createHealingAction({
                   modelId: m.id,
                   action: "Pause",
                   reason: `Model overloaded (Latency: ${Math.round(newLatency)}ms, Mem: ${Math.round(newMemory)}%). Paused due to low priority.`
                 });
                 newLatency = 0;
                 newMemory = 0;
                 newNpu = 0;
              } else {
                 await storage.createHealingAction({
                   modelId: m.id,
                   action: "Rebalance",
                   reason: `Model overloaded (Latency: ${Math.round(newLatency)}ms, Mem: ${Math.round(newMemory)}%). Rebalancing NPU allocation.`
                 });
                 newLatency = m.targetLatency * 0.8; 
                 newStatus = 'running';
              }
            } else {
              newStatus = 'running';
            }
          }
        }
        
        await storage.updateModel(m.id, {
          status: newStatus,
          currentLatency: Math.round(newLatency),
          currentMemory: Math.round(newMemory),
          currentNpu: Math.round(newNpu)
        });
        
        await storage.createMetric({
          modelId: m.id,
          latency: Math.round(newLatency),
          memory: Math.round(newMemory),
          npu: Math.round(newNpu)
        });
      }
    } catch (e) {
      console.error("Simulation error", e);
    }
  }, 2000); 
}