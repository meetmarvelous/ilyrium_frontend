"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  Server,
  Cpu,
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/layout/Logo";

export default function LandingPage() {
  const [liveLog, setLiveLog] = useState<
    { id: string; region: string; provider: string; latency: string }[]
  >([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const regions = ["US-EAST", "EU-WEST", "ASIA-SOUTH", "LATAM-1"];
    const providers = ["HELIUS", "QUICKNODE", "TRITON", "SOLANA-DEVNET"];

    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(36).substring(7),
        region: regions[Math.floor(Math.random() * regions.length)],
        provider: providers[Math.floor(Math.random() * providers.length)],
        latency: `${(2.0 + Math.random() * 1.5).toFixed(2)}ms`,
      };
      setLiveLog((prev) => [newLog, ...prev].slice(0, 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const partners = [
    "SOLANA",
    "HELIUS",
    "QUICKNODE",
    "JUPITER",
    "PYTH",
    "DRIFT",
    "MARGINFI",
    "KAMINO",
    "PHANTOM",
    "METAPLEX",
  ];

  return (
    <div className="min-h-screen bg-background text-text-main relative overflow-hidden font-body selection:bg-primary/20">
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />

        <div className="relative h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
            <Logo className="w-8 h-8" showText={true} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-text-muted hover:text-text-main transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Comparison", href: "#comparison" },
              { label: "Architecture", href: "#architecture" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between group py-2"
              >
                <span className="text-xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ChevronRight
                  size={18}
                  className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-border">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-bold tracking-tight text-sm mb-6 shadow-[0_0_25px_rgba(79,70,229,0.4)]"
            >
              Launch Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/">
            <Logo className="w-8 h-8" showText={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <Link href="#features" className="hover:text-text-main transition-colors">
              Features
            </Link>
            <Link href="#comparison" className="hover:text-text-main transition-colors">
              Comparison
            </Link>
            <Link href="#architecture" className="hover:text-text-main transition-colors">
              Architecture
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] text-xs"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-text-muted hover:text-text-main transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section (Clean Dark Canvas - Video Removed for Maximum Readability) */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden">
        {/* Subtle Radial Glow Effect */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface border border-border">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-mono text-text-muted font-medium">
              Indestructible Solana RPC Aggregator
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black leading-[1.08] tracking-tighter text-text-main">
            Unifying Solana Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-primary to-purple-400">
              Into One Indestructible Network.
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Ilyrium is an intelligent proxy layer that aggregates top-tier RPC providers like Helius and QuickNode into a single high-availability endpoint. Zero-downtime failover and sub-3ms latency built for high-stakes Web3 applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all text-sm group"
            >
              Start Building
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#architecture"
              className="px-8 py-4 rounded-xl border border-border bg-surface hover:bg-surfaceHover text-text-muted hover:text-text-main font-semibold transition-all text-sm"
            >
              Explore Architecture
            </Link>
          </div>

          {/* Live Ping Ticker */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 opacity-80">
            {liveLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2 bg-surface/80 backdrop-blur-md border border-border px-3.5 py-2 rounded-xl text-xs font-mono"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-text-muted">{log.region}</span>
                <span className="text-primary font-bold">{log.provider}</span>
                <span className="text-emerald-400 font-semibold">
                  {log.latency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Marquee */}
      <div className="border-y border-border py-8 overflow-hidden relative bg-surface/30">
        <div className="flex whitespace-nowrap gap-16 items-center justify-center opacity-40 font-mono text-sm tracking-widest uppercase font-bold">
          {partners.map((partner, i) => (
            <span key={`${partner}-${i}`}>{partner}</span>
          ))}
        </div>
      </div>

      {/* Core Features Section */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
            Core Technology
          </p>
          <h2 className="text-4xl font-heading font-bold text-text-main tracking-tight">
            Designed for Sub-Millisecond Speed & Absolute Uptime
          </h2>
          <p className="text-text-muted">
            The Ilyrium routing engine abstracts provider failures, rate-limit blocks, and regional lag behind a unified endpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 transition-all space-y-4 group">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-main">
              Sub-Second Failover
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              If a primary RPC provider returns an error or experiences a lag spike, Ilyrium transparently retries against fallback providers before returning to your app.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 transition-all space-y-4 group">
            <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-2xl w-fit">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-main">
              Sub-3ms Overhead
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Written in high-concurrency Golang with in-memory Redis session caching. The proxy adds virtually zero latency to your hot path calls.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 transition-all space-y-4 group">
            <div className="p-3 bg-purple-400/10 text-purple-400 rounded-2xl w-fit">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-main">
              Web3 Native Billing
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              No credit cards or KYC required. Upgrade your request limits directly on-chain using native SOL transfers verified automatically by our backend.
            </p>
          </div>
        </div>

      </section>

      {/* Architecture Showcase with Second Media Card */}
      <section id="architecture" className="py-20 max-w-6xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
              System Architecture
            </p>
            <h2 className="text-4xl font-heading font-bold text-text-main tracking-tight leading-tight">
              High-Concurrency Go Engine Meets In-Memory Caching
            </h2>
            <p className="text-text-muted text-base leading-relaxed">
              Requests pass through a zero-allocation Go proxy. API key verification and rate-limiting happen instantly in Redis, while usage metrics are flushed asynchronously to PostgreSQL without blocking client responses.
            </p>
            <div className="space-y-3">
              {[
                "Stateless Go Routing Nodes for Infinite Scaling",
                "Redis In-Memory Hot Path Authentication",
                "Asynchronous PostgreSQL Batch Usage Logging",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-text-main">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden border border-border h-96 flex items-end p-8 group shadow-[0_0_40px_rgba(0,0,0,0.1)]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            >
              <source
                src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Video%20Preventa.mp4?alt=media&token=96330534-69e6-47e3-8359-444f9c1f85a5"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
                Network Visualizer
              </span>
              <h4 className="text-xl font-heading font-bold text-white">
                Live Node Health Monitoring
              </h4>
              <p className="text-xs text-white/70">
                Sub-second health score evaluation across Helius, QuickNode, and Triton endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 bg-surface/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
              The Meta-RPC Difference
            </p>
            <h2 className="text-3xl font-heading font-bold text-text-main">
              Single Provider vs. Ilyrium Layer
            </h2>
          </div>

          <div className="bg-surface border border-border rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surfaceHover/50 border-b border-border text-text-muted text-xs font-mono uppercase">
                <tr>
                  <th className="px-6 py-4">FEATURE</th>
                  <th className="px-6 py-4">SINGLE RPC PROVIDER</th>
                  <th className="px-6 py-4 text-primary">ILYRIUM META-RPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-medium">
                <tr>
                  <td className="px-6 py-4 text-text-main font-bold">Automatic Failover</td>
                  <td className="px-6 py-4 text-text-muted">❌ Manual client code</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> Transparent Sub-100ms
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-text-main font-bold">Single Point of Failure</td>
                  <td className="px-6 py-4 text-text-muted">❌ Vulnerable to outages</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> 100% Provider Agnostic
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-text-main font-bold">Billing & Settlement</td>
                  <td className="px-6 py-4 text-text-muted">Credit Card / KYC</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> Native SOL On-Chain
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-text-main font-bold">Proxy Overhead</td>
                  <td className="px-6 py-4 text-text-muted">Direct</td>
                  <td className="px-6 py-4 text-primary font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> &lt; 3.0ms Latency
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-border text-sm text-text-muted">
        <div className="flex items-center gap-4">
          <Logo className="w-8 h-8" showText={true} />
        </div>
        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEMS OPERATIONAL
          </span>
          <Link href="/dashboard" className="hover:text-text-main transition-colors">
            Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
