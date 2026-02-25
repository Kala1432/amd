import { useParams, Link } from "wouter";
import { useModel } from "@/hooks/use-models";
import { useMetrics } from "@/hooks/use-metrics";
import { Navbar } from "@/components/layout/Navbar";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { ArrowLeft, Cpu, Activity, HardDrive, Target } from "lucide-react";

export default function ModelDetails() {
  const { id } = useParams();
  const modelId = parseInt(id || "0", 10);
  const { data: model, isLoading: modelLoading } = useModel(modelId);
  const { data: metrics, isLoading: metricsLoading } = useMetrics(modelId);

  if (modelLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-2xl font-bold text-foreground font-display">Model Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">The requested AI model does not exist or has been removed.</p>
          <Link href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation / Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Fleet
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">{model.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                    {model.type}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded">
                    Priority: {model.priority}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded">
                    Status: {model.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Latency</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-display font-bold text-foreground">{model.currentLatency}</span>
              <span className="text-sm text-muted-foreground mb-1">ms</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Target: {model.targetLatency}ms
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><HardDrive className="w-16 h-16" /></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Memory Usage</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-display font-bold text-foreground">{model.currentMemory}</span>
              <span className="text-sm text-muted-foreground mb-1">%</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
               <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${model.currentMemory}%` }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Cpu className="w-16 h-16" /></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">NPU Utilization</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-display font-bold text-foreground">{model.currentNpu}</span>
              <span className="text-sm text-muted-foreground mb-1">%</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
               <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${model.currentNpu}%` }} />
            </div>
          </div>
        </div>

        {/* Charts Area */}
        <div className="bg-card border border-border rounded-xl shadow-lg shadow-black/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Performance Telemetry
            </h2>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Latency</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Memory</div>
            </div>
          </div>
          
          <div className="h-[400px]">
            {metricsLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-secondary/10 rounded-lg animate-pulse">
                <span className="text-muted-foreground uppercase tracking-widest text-sm">Loading Telemetry...</span>
              </div>
            ) : (
              <MetricsChart data={metrics || []} />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
