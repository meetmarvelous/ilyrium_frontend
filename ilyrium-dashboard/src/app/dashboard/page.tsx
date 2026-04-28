"use client";

import { 
  Activity, 
  ArrowUpRight, 
  Cpu, 
  Globe, 
  Zap,
  ShieldCheck,
  Key,
  Settings,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Total Requests", value: "2.4M", change: "+12.5%", icon: Zap, color: "text-accent-blue" },
  { name: "Avg. Latency", value: "3.2ms", change: "-0.4ms", icon: Activity, color: "text-primary" },
  { name: "Global Nodes", value: "12", change: "Active", icon: Globe, color: "text-accent-green" },
  { name: "Success Rate", value: "99.99%", change: "Stable", icon: ShieldCheck, color: "text-primary" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12 stagger-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Network Status: Operational</p>
          <h1 className="text-4xl lg:text-5xl">System Overview</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/logs" className="btn-secondary">
            Export Logs
          </Link>
          <Link href="/dashboard/billing" className="btn-primary">
            <ArrowUpRight size={18} />
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-[32px] premium-shadow border border-border group hover:border-primary transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={64} />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-surface ${stat.color} group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black mono text-accent-green bg-accent-green/10 px-3 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-bold text-text-muted mb-1 relative z-10">{stat.name}</p>
            <h2 className="text-4xl font-black relative z-10">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 lg:p-10 border border-border premium-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-2xl mb-1">Request Volume</h3>
               <p className="text-sm text-text-muted font-medium">Real-time throughput across all regions</p>
            </div>
            <select className="bg-surface border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:border-primary transition-all">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="h-80 w-full bg-surface/30 rounded-[32px] border border-border/50 flex items-center justify-center relative overflow-hidden">
             {/* Abstract Data Visualization */}
             <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-3 h-48">
                {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95, 70, 85, 45, 60, 90, 75, 55, 80].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary/30 transition-all duration-1000" 
                    style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }} 
                  />
                ))}
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
             <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-border shadow-sm">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <p className="text-[10px] font-black mono text-text-main">Live Network Pulse Active</p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Subscription Card */}
           <div className="bg-text-main rounded-[40px] p-10 text-white premium-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] mono font-bold">Current Tier</span>
                    <span className="text-xs font-black text-primary bg-white px-3 py-1 rounded-full">PRO</span>
                 </div>
                 <h4 className="text-3xl font-black mb-2">Scale Tier</h4>
                 <p className="text-sm text-white/60 mb-8 font-medium">Next billing cycle: May 12, 2024</p>
                 
                 <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between text-xs font-bold">
                       <span className="text-white/80">Monthly Quota</span>
                       <span>65%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                       <div className="bg-primary h-full w-[65%] shadow-[0_0_20px_rgba(47,64,209,0.5)]" />
                    </div>
                 </div>

                 <Link href="/dashboard/billing" className="w-full py-4 rounded-2xl bg-white text-text-main font-black text-sm flex items-center justify-center gap-2 hover:bg-surface transition-all">
                    Manage Plan
                    <ArrowRight size={18} />
                 </Link>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-white rounded-[40px] p-10 border border-border premium-shadow">
              <h4 className="text-xl mb-8">Quick Actions</h4>
              <div className="space-y-4">
                <Link href="/dashboard/keys" className="w-full p-5 rounded-2xl border border-border hover:border-primary group transition-all flex items-center gap-4 bg-surface/30">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <Key size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Rotate Keys</p>
                    <p className="text-[10px] text-text-muted font-medium">Secure your access</p>
                  </div>
                </Link>
                <Link href="/dashboard/settings" className="w-full p-5 rounded-2xl border border-border hover:border-primary group transition-all flex items-center gap-4 bg-surface/30">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <Settings size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Preferences</p>
                    <p className="text-[10px] text-text-muted font-medium">Account security</p>
                  </div>
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
