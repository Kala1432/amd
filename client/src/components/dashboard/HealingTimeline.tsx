import { useHealingActions } from "@/hooks/use-healing-actions";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, Wrench, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HealingTimeline() {
  const { data: actions, isLoading } = useHealingActions();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
        <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No healing actions recorded</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('restart')) return <RotateCcwIcon className="w-4 h-4" />;
    if (act.includes('pause')) return <Wrench className="w-4 h-4" />;
    if (act.includes('throttle')) return <Zap className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  const RotateCcwIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );

  return (
    <div className="relative pl-2">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-4 bottom-0 w-px bg-border" />
      
      <div className="space-y-6">
        <AnimatePresence>
          {actions.slice(0, 10).map((action: any, i: number) => (
            <motion.div 
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-4 items-start group"
            >
              <div className="relative z-10 mt-0.5 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border border-accent text-accent shadow-[0_0_10px_rgba(249,115,22,0.2)] group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                {getActionIcon(action.action)}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{action.action}</h4>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                  {action.reason}
                </p>
                <div className="mt-2 inline-flex">
                   <span className="text-[10px] bg-secondary/50 px-2 py-0.5 rounded border border-border text-muted-foreground">
                     Model ID: {action.modelId}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
