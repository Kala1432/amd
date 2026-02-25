# RyzenGuard: Edge AI Workload Orchestrator

RyzenGuard intelligently monitors, prioritizes, and auto-heals multiple AI workloads running on AMD Ryzen AI edge devices, ensuring optimal performance and reliability.

## 🚀 Features
- **Real-Time Edge AI Dashboard**: Monitor latency, memory, and NPU usage across multiple models.
- **Priority Scheduling**: Allocates NPU resources effectively—critical models (like Object Detection) stay running, while low-priority models (like Anomaly Detection) are paused during resource starvation.
- **Self-Healing AI Workloads**: Automatically restarts crashed models and rebalances resources when an overload is detected.
- **Metrics Simulation Engine**: A continuous background loop testing system constraints with randomized load spikes and failures.

## 🧱 Architecture
- **Frontend**: React, TailwindCSS, Shadcn, TanStack Query, Recharts.
- **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL.
- **Simulation Layer**: A fast Node.js worker loop running parallel to the Express server to simulate live edge device metrics and trigger Kubernetes-style auto-healing workflows.

## 🚦 How It Works
1. The Express server powers up and checks the PostgreSQL database.
2. The simulation loop runs every 2 seconds, adjusting NPU, Latency, and Memory loads for each model.
3. If a model crosses its latency/memory threshold, the system analyzes its priority.
4. High-priority workloads are saved by actively pausing low-priority ones or dynamically rebalancing NPU allocation.
5. The React frontend polls the REST API rapidly to display a live feed of charts and healing actions.