"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Globe, 
  Shield, 
  Zap, 
  Activity, 
  Cpu, 
  Lock, 
  Network,
  ChevronRight,
  Database,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [liveLog, setLiveLog] = useState<{ id: string, region: string, status: string }[]>([]);

  useEffect(() => {
    const regions = ["US-EAST", "EU-WEST", "ASIA-SOUTH", "LATAM-1"];
    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(36).substring(7),
        region: regions[Math.floor(Math.random() * regions.length)],
        status: "DIVERTE-SUCCESS"
      };
      setLiveLog(prev => [newLog, ...prev].slice(0, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const partners = ["SOLANA", "PYTH", "JUPITER", "DRIFT", "MARGINFI", "KAMINO", "PHANTOM", "HELIUM", "METAPLEX", "HNT", "BONK", "WIF"];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-body selection:bg-primary/10">
      {/* Hero Section - Reduced Height & Spacing */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.35] scale-105"
          >
            <source src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20Video%20Luxor.mp4?alt=media&token=a5cd5a16-be9f-43df-bd1e-e702012fa88d" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
        </div>

        <nav className="absolute top-0 left-0 right-0 h-20 z-50">
           <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
              <Logo className="w-7 h-7" />
              <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">
                <Link href="#solutions" className="hover:text-primary transition-colors">Solutions</Link>
                <Link href="#network" className="hover:text-primary transition-colors">Infrastructure</Link>
                <Link href="#comparison" className="hover:text-primary transition-colors">Comparison</Link>
                <Link href="/dashboard" className="px-6 py-2.5 rounded-2xl bg-text-main text-white hover:bg-primary transition-all normal-case tracking-normal text-xs">
                  Dashboard
                </Link>
              </div>
           </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center relative z-10 stagger-in">
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-[10px] mono font-black text-primary tracking-[0.1em] uppercase">Enterprise RPC Infrastructure</span>
          </div>

          <h1 className="text-5xl lg:text-[92px] font-black leading-[1.05] tracking-tighter text-text-main mb-8">
            Powering <br />
            <span className="text-primary italic">High-Stakes</span> <br />
            Onchain Apps.
          </h1>

          <p className="text-base lg:text-[17px] text-text-muted max-w-xl mx-auto font-medium leading-relaxed opacity-80 mb-10">
            The global intelligence layer for the Solana ecosystem. 
            Zero-config failover and sub-3ms latency built for the next billion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/dashboard" className="btn-primary py-4 px-10 rounded-2xl group text-[13px] shadow-2xl shadow-primary/20">
              Start Building
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#solutions" className="btn-secondary py-4 px-10 rounded-2xl text-[13px]">
              Docs
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 opacity-60">
             {liveLog.map((log) => (
                <div key={log.id} className="flex items-center gap-2 animate-fadeIn">
                   <div className="w-1 h-1 rounded-full bg-accent-green" />
                   <span className="text-[10px] mono font-bold uppercase tracking-widest">{log.region}</span>
                   <span className="text-[10px] mono text-primary font-black tracking-tighter">{log.status}</span>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Marquee Section - Balanced Padding */}
      <div className="border-y border-border/40 py-10 overflow-hidden relative bg-white z-20 w-full">
        <div className="flex animate-marquee-slow whitespace-nowrap gap-24 items-center mask-fade-edges opacity-30 grayscale hover:opacity-60 transition-opacity w-max">
           {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
              <span key={`${partner}-${i}`} className="text-xl font-black tracking-tighter uppercase">{partner}</span>
           ))}
        </div>
      </div>

      {/* Solutions Section - Tighter Spacing */}
      <section id="solutions" className="py-16 lg:py-20 bg-white relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
               <div>
                  <p className="mono-label text-primary mb-3">Core Technology</p>
                  <h2 className="text-4xl lg:text-5xl tracking-tighter leading-[1.05]">Designed for the <br /> <span className="text-primary italic font-black">Speed of Light.</span></h2>
               </div>
               <p className="text-base text-text-muted font-medium leading-relaxed opacity-80">
                  Our intelligence layer optimizes every request, ensuring absolute minimal latency and maximal reliability.
               </p>
               <div className="space-y-3 pt-2">
                  {["Smart Regional Diversion", "Priority Fee Optimization", "gRPC / Webhooks Support"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-black text-text-main">
                      <CheckCircle2 size={18} className="text-accent-green" />
                      {item}
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-surface/50 rounded-[40px] p-8 lg:p-10 border border-border hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl premium-shadow flex items-center justify-center text-primary mb-6">
                     <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight">Auto-Failover</h3>
                  <p className="text-[14px] text-text-muted font-medium opacity-70 leading-relaxed">
                     Real-time node health monitoring with automatic sub-100ms diversion.
                  </p>
               </div>
               <div className="bg-text-main rounded-[40px] p-8 lg:p-10 text-white border border-white/5 premium-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Shield size={120} />
                  </div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight">Access Control</h3>
                  <p className="text-[14px] text-white/50 font-medium leading-relaxed">
                     Granular permissions and regional constraints for institutional keys.
                  </p>
               </div>
               <div className="sm:col-span-2 bg-white rounded-[40px] p-1.5 border border-border premium-shadow relative overflow-hidden min-h-[320px]">
                  <video 
                     autoPlay 
                     loop 
                     muted 
                     playsInline 
                     className="absolute inset-0 w-full h-full object-cover rounded-[36px]"
                  >
                     <source src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Video%20Preventa.mp4?alt=media&token=96330534-69e6-47e3-8359-444f9c1f85a5" type="video/mp4" />
                  </video>
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-border/50">
                     <p className="text-[10px] font-black mono text-primary mb-1 tracking-widest uppercase">Analytics Engine</p>
                     <p className="text-sm font-black text-text-main">Global Pulse Interface</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Tighter Spacing */}
      <section id="comparison" className="py-16 lg:py-20 bg-surface/20">
        <div className="max-w-6xl mx-auto px-6">
           <div className="max-w-4xl mx-auto text-center mb-12">
              <p className="mono-label text-primary mb-3">The Difference</p>
              <h2 className="text-4xl lg:text-5xl tracking-tighter leading-tight">Standard RPC vs. <br /> <span className="text-primary italic">Ilyrium Engine.</span></h2>
           </div>
           
           <div className="bg-white rounded-[48px] border border-border premium-shadow overflow-hidden max-w-4xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-3">
                 <div className="p-8 lg:p-10 border-r border-border bg-surface/10 hidden lg:block">
                    <div className="h-10 mb-8" />
                    <ul className="space-y-6 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">
                       <li>Global Routing</li>
                       <li>Auto-Failover</li>
                       <li>Batching Engine</li>
                       <li>P99 Latency</li>
                       <li>Security Layer</li>
                    </ul>
                 </div>
                 <div className="p-8 lg:p-10 border-r border-border text-center">
                    <p className="text-xs font-black text-text-muted mb-8 uppercase tracking-[0.2em]">Others</p>
                    <ul className="space-y-6">
                       {[false, false, true, "24ms", "Basic"].map((item, i) => (
                          <li key={i} className="flex justify-center h-4 items-center">
                             {typeof item === "boolean" ? (
                                item ? <CheckCircle2 size={18} className="text-accent-green" /> : <div className="w-4 h-[2px] bg-border" />
                             ) : (
                                <span className="text-sm font-bold text-text-muted">{item}</span>
                             )}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <div className="p-8 lg:p-10 bg-primary/[0.02] text-center relative overflow-hidden">
                    <p className="text-xs font-black text-primary mb-8 uppercase tracking-[0.2em]">Ilyrium</p>
                    <ul className="space-y-6 relative z-10">
                       {[true, true, true, "3.2ms", "AES-256"].map((item, i) => (
                          <li key={i} className="flex justify-center h-4 items-center">
                             {typeof item === "boolean" ? (
                                <CheckCircle2 size={18} className="text-primary" />
                             ) : (
                                <span className="text-sm font-black text-primary">{item}</span>
                             )}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Global Stats - Tighter Spacing */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                 <p className="text-5xl lg:text-7xl font-black tracking-tighter text-primary">2.4M+</p>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Transactions</p>
              </div>
              <div className="space-y-2">
                 <p className="text-5xl lg:text-7xl font-black tracking-tighter text-text-main">3.2ms</p>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Edge Latency</p>
              </div>
              <div className="space-y-2">
                 <p className="text-5xl lg:text-7xl font-black tracking-tighter text-accent-blue">100%</p>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Redundancy</p>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-20 lg:py-24 px-6 border-t border-border bg-white relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="space-y-8">
              <Logo className="w-7 h-7" />
              <p className="text-[13px] text-text-muted max-w-xs font-medium leading-relaxed opacity-70">
                The premier RPC aggregation layer for the Solana blockchain.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
              <div className="space-y-5">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-main opacity-40">Platform</h4>
                 <ul className="text-[13px] text-text-muted space-y-3 font-bold">
                    <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                    <li><Link href="/dashboard/nodes" className="hover:text-primary transition-colors">Nodes</Link></li>
                    <li><Link href="/dashboard/billing" className="hover:text-primary transition-colors">Pricing</Link></li>
                 </ul>
              </div>
              <div className="space-y-5">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-main opacity-40">Docs</h4>
                 <ul className="text-[13px] text-text-muted space-y-3 font-bold">
                    <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">CLI Tool</Link></li>
                 </ul>
              </div>
              <div className="space-y-5">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-main opacity-40">Connect</h4>
                 <ul className="text-[13px] text-text-muted space-y-3 font-bold">
                    <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10">
             <p className="text-[10px] mono text-text-muted font-bold tracking-[0.3em] opacity-40 uppercase">© 2024 ILYRIUM INFRASTRUCTURE SYSTEMS.</p>
             <div className="flex items-center gap-8 text-[10px] mono text-text-muted font-bold tracking-widest opacity-60">
                <span className="flex items-center gap-2 font-black"><div className="w-1.5 h-1.5 rounded-full bg-accent-green" /> SYSTEMS ACTIVE</span>
                <span>v1.4.2</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
