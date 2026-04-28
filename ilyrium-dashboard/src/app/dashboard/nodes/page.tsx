"use client";

import { 
  Activity, 
  ChevronRight, 
  Globe, 
  MapPin, 
  Network, 
  Server, 
  Shield 
} from "lucide-react";

const nodes = [
  { region: "US East (N. Virginia)", provider: "AWS", status: "Active", latency: "12ms", load: "42%" },
  { region: "US West (Oregon)", provider: "GCP", status: "Active", latency: "24ms", load: "18%" },
  { region: "EU (Frankfurt)", provider: "AWS", status: "Active", latency: "8ms", load: "65%" },
  { region: "Asia Pacific (Tokyo)", provider: "Azure", status: "Active", latency: "45ms", load: "12%" },
  { region: "South America (São Paulo)", provider: "Vultr", status: "Diverted", latency: "120ms", load: "0%" },
];

export default function NodesPage() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Global Infrastructure</p>
          <h1 className="text-4xl">Nodes & Routing</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Shield size={18} />
            Security Audit
          </button>
          <button className="btn-primary">
            <Network size={18} />
            Optimize Routing
          </button>
        </div>
      </div>

      {/* Network Map Visualization Placeholder */}
      <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-border premium-shadow relative overflow-hidden group min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-glow)_0%,_transparent_70%)] opacity-50" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Globe size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl mb-2">Global Traffic Relay</h3>
          <p className="text-text-muted max-w-sm mx-auto">
            Our intelligent routing engine is currently balancing traffic across 12 healthy nodes globally.
          </p>
        </div>
        
        {/* Mock Map Points */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping" />
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-accent-blue rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent-green rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl px-2">Active Node Registry</h3>
          <div className="bg-white rounded-[32px] border border-border premium-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-8 py-5 mono-label">Location</th>
                    <th className="px-8 py-5 mono-label">Provider</th>
                    <th className="px-8 py-5 mono-label">Latency</th>
                    <th className="px-8 py-5 mono-label">Status</th>
                    <th className="px-8 py-5 mono-label text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {nodes.map((node, i) => (
                    <tr key={i} className="hover:bg-surface/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-primary" />
                          <span className="font-bold text-sm">{node.region}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-text-muted font-medium">{node.provider}</td>
                      <td className="px-8 py-6 text-sm font-mono text-accent-blue">{node.latency}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          node.status === "Active" 
                            ? "bg-accent-green/10 text-accent-green" 
                            : "bg-orange-500/10 text-orange-500"
                        }`}>
                          {node.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl hover:bg-white hover:text-primary transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl px-2">Routing Performance</h3>
          <div className="bg-white rounded-[32px] p-8 border border-border premium-shadow space-y-8">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-text-muted mb-1">Global P99 Latency</p>
                   <p className="text-3xl font-black text-primary">3.4ms</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                   <Activity size={24} />
                </div>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                   <span>Node Capacity</span>
                   <span className="text-primary">82%</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-[82%]" />
                </div>
             </div>

             <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
                <Server size={20} className="text-text-muted" />
                <div>
                   <p className="text-[10px] mono">Failover Mode</p>
                   <p className="text-sm font-bold">Automatic / Enabled</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
