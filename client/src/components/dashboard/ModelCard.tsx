import { Play, Pause, RotateCcw, Activity, Cpu, HardDrive, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useUpdateModel } from "@/hooks/use-models";
import { motion } from "framer-motion";

interface ModelCardProps {
  model: any; // Type inferred from schema
}

export function ModelCard({ model }: ModelCardProps) {
  const updateModel = useUpdateModel();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Running', indicator: 'bg-emerald-500' };
      case 'overloaded':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Overloaded', indicator: 'bg-orange-500' };
      case 'crashed':
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Crashed', indicator: 'bg-red-500' };
      case 'paused':
        return { color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', label: 'Paused', indicator: 'bg-zinc-500' };
      default:
        return { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', label: status, indicator: 'bg-zinc-500' };
    }
  };

  const statusConfig = getStatusConfig(model.status);
  const latencyOver = model.currentLatency > model.targetLatency;

  const handleToggleState = () => {
    const newStatus = model.status === 'paused' ? 'running' : 'paused';
    updateModel.mutate({ id: model.id, status: newStatus });
  };

  const handleRestart = () => {
    updateModel.mutate({ id: model.id, status: 'running' });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-300 shadow-xl overflow-hidden`}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-foreground font-display tracking-wide">{model.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">
              {model.type}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${model.priority === 'high' ? 'text-primary border-primary/30 bg-primary/10' : 'text-zinc-400 border-zinc-700 bg-zinc-800/50'}`}>
              {model.priority} Priority
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.border} ${statusConfig.bg}`}>
          <div className={`w-2 h-2 rounded-full ${statusConfig.indicator} ${model.status === 'running' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-secondary/40 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wider">Latency</span>
            </div>
            {latencyOver && <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-display font-bold ${latencyOver ? 'text-orange-500' : 'text-foreground'}`}>
              {model.currentLatency}
            </span>
            <span className="text-xs text-muted-foreground">/ {model.targetLatency}ms</span>
          </div>
        </div>

        <div className="bg-secondary/40 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-wider">Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${model.currentMemory > 85 ? 'bg-red-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min(100, model.currentMemory)}%` }}
              />
            </div>
            <span className="text-sm font-bold font-display">{model.currentMemory}%</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
        <Link href={`/model/${model.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          View Analytics →
        </Link>
        
        <div className="flex gap-2">
          <button 
            onClick={handleToggleState}
            disabled={updateModel.isPending}
            className="flex items-center justify-center w-8 h-8 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border hover:border-primary/50"
            title={model.status === 'paused' ? 'Start' : 'Pause'}
          >
            {model.status === 'paused' ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleRestart}
            disabled={updateModel.isPending}
            className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/20 hover:border-primary/50"
            title="Force Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
