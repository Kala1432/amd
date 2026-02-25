import { Cpu, ShieldAlert, Activity } from "lucide-react";
import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Cpu className="w-6 h-6 text-primary group-hover:animate-pulse" />
              <div className="absolute inset-0 rounded-lg glow-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-foreground leading-none">Ryzen<span className="text-primary">Guard</span></span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1">Edge Orchestrator</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>System Live</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
