import { useModels } from "@/hooks/use-models";
import { Navbar } from "@/components/layout/Navbar";
import { ModelCard } from "@/components/dashboard/ModelCard";
import { HealingTimeline } from "@/components/dashboard/HealingTimeline";
import { ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: models, isLoading } = useModels();

  // Stats for the header
  const totalModels = models?.length || 0;
  const overloadedModels = models?.filter(m => m.status === 'overloaded' || m.status === 'crashed').length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Cpu className="w-8 h-8 text-primary" />
              Edge Fleet Control
            </h1>
            <p className="text-muted-foreground mt-1">Real-time monitoring and auto-healing orchestration</p>
          </div>
          
          <div className="flex items-center gap-4 bg-card border border-border p-3 rounded-lg shadow-sm">
            <div className="flex flex-col px-3 border-r border-border">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Active Nodes</span>
              <span className="text-2xl font-display font-bold text-foreground leading-none mt-1">{totalModels}</span>
            </div>
            <div className="flex flex-col px-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">System Status</span>
              {overloadedModels > 0 ? (
                 <span className="text-sm font-bold text-orange-500 mt-1 flex items-center gap-1">
                   {overloadedModels} Issues Detected
                 </span>
              ) : (
                 <span className="text-sm font-bold text-emerald-500 mt-1 flex items-center gap-1">
                   <ShieldCheck className="w-4 h-4" /> All Systems Nominal
                 </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Grid: Models */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold text-foreground">Deployed Models</h2>
              <div className="h-px bg-border flex-1 ml-4 hidden sm:block" />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-card border border-border h-64 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : models?.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground">No Models Deployed</h3>
                <p className="text-muted-foreground mt-2">Connect edge devices to begin orchestration.</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {models?.map((model: any) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar: Auto-Healing Actions */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-card border border-border rounded-xl shadow-lg shadow-black/20 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-border bg-secondary/30 flex justify-between items-center">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Auto-Healing Log
                </h2>
              </div>
              <div className="p-5 max-h-[600px] overflow-y-auto">
                <HealingTimeline />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
