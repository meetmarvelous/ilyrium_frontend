"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import bs58 from "bs58";
import {
  ShieldAlert,
  ShieldCheck,
  Key,
  Users,
  Activity,
  Cpu,
  RefreshCw,
  Terminal,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Server,
  Database,
  ArrowRight,
  LogOut,
  Search,
  Sliders,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

// Dynamically import WalletMultiButton to prevent SSR hydration mismatch
const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod: any) => mod.WalletMultiButton || mod.default?.WalletMultiButton || mod.default
    ),
  { ssr: false }
) as React.ComponentType<{ className?: string }>;

interface TelemetryData {
  totalUsers: number;
  totalKeys: number;
  activeKeys: number;
  revokedKeys: number;
  totalRequests: number;
  totalErrors: number;
  avgLatency: string;
  errorRate: string;
  planCounts: Record<string, number>;
}

interface RecentUser {
  id: string;
  wallet_address: string;
  plan: string;
  created_at: string;
}

interface RecentKey {
  id: string;
  name: string;
  masked_key: string;
  status: string;
  user_wallet: string;
  created_at: string;
}

interface DiagnosticResult {
  success: boolean;
  targetUrl: string;
  status: "online" | "degraded" | "offline";
  httpStatus?: number;
  latencyMs: number;
  nodeVersion?: string;
  currentSlot?: number;
  rawResponse?: unknown;
  error?: string;
}

export default function AdminPortalPage() {
  const { publicKey, signMessage, connected } = useWallet();

  // Authentication State
  const [passphrase, setPassphrase] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Stored Session Credentials
  const [adminSession, setAdminSession] = useState<{
    wallet: string;
    passphrase: string;
    signature: string;
    nonce: string;
  } | null>(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"overview" | "rpc-tests" | "users">("overview");
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentKeys, setRecentKeys] = useState<RecentKey[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // RPC Diagnostic State
  const [selectedTarget, setSelectedTarget] = useState<"primary" | "fallback" | "custom">("primary");
  const [customRpcUrl, setCustomRpcUrl] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const walletAddress = publicKey?.toBase58() || "";

  // Perform Cryptographic Sign-in with Solana
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!connected || !publicKey || !signMessage) {
      setAuthError("Please connect an authorized Solana wallet first.");
      return;
    }

    if (!passphrase.trim()) {
      setAuthError("Please enter the Master Admin Passphrase.");
      return;
    }

    setAuthLoading(true);

    try {
      // 1. Request Server Nonce Challenge
      const nonceRes = await fetch("/api/admin/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          passphrase: passphrase.trim(),
        }),
      });

      const nonceData = await nonceRes.json();
      if (!nonceRes.ok || !nonceData.nonce) {
        throw new Error(nonceData.error || "Authentication challenge failed.");
      }

      // 2. Cryptographically Sign the Nonce with the Solana Wallet
      const messageBytes = new TextEncoder().encode(nonceData.nonce);
      const signatureBytes = await signMessage(messageBytes);
      const signatureBase58 = bs58.encode(signatureBytes);

      const session = {
        wallet: walletAddress,
        passphrase: passphrase.trim(),
        signature: signatureBase58,
        nonce: nonceData.nonce,
      };

      setAdminSession(session);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch Admin Telemetry & Metrics
  const fetchMetrics = useCallback(async () => {
    if (!adminSession) return;
    setDataLoading(true);

    try {
      const res = await fetch("/api/admin/metrics", {
        headers: {
          "x-admin-wallet": adminSession.wallet,
          "x-admin-passphrase": adminSession.passphrase,
          "x-admin-signature": adminSession.signature,
          "x-admin-nonce": adminSession.nonce,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTelemetry(data.telemetry);
        setRecentUsers(data.recentUsers || []);
        setRecentKeys(data.recentKeys || []);
      } else {
        if (res.status === 403 || res.status === 401) {
          // Session expired or invalid
          setIsAuthenticated(false);
          setAdminSession(null);
          setAuthError(data.error || "Session expired. Please re-authenticate.");
        }
      }
    } catch {
      // ignore
    } finally {
      setDataLoading(false);
    }
  }, [adminSession]);

  // Execute Live Upstream RPC Test
  const runRpcDiagnostic = async () => {
    if (!adminSession) return;
    setTestLoading(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch("/api/admin/test-rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-wallet": adminSession.wallet,
          "x-admin-passphrase": adminSession.passphrase,
          "x-admin-signature": adminSession.signature,
          "x-admin-nonce": adminSession.nonce,
        },
        body: JSON.stringify({
          target: selectedTarget,
          customUrl: selectedTarget === "custom" ? customRpcUrl.trim() : undefined,
        }),
      });

      const data = await res.json();
      setDiagnosticResult(data);
    } catch (err: unknown) {
      setDiagnosticResult({
        success: false,
        targetUrl: selectedTarget,
        status: "offline",
        latencyMs: 0,
        error: err instanceof Error ? err.message : "Test failed to run",
      });
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminSession) {
      fetchMetrics();
    }
  }, [isAuthenticated, adminSession, fetchMetrics]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminSession(null);
    setPassphrase("");
    setDiagnosticResult(null);
  };

  // Filtered lists based on search query
  const filteredUsers = recentUsers.filter((u) =>
    u.wallet_address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredKeys = recentKeys.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.user_wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.masked_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-main font-body selection:bg-primary/20">
      {/* Top Admin Security Bar */}
      <header className="h-16 border-b border-border bg-surface/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo className="w-6 h-6" showText={false} />
          </Link>
          <div className="h-4 w-px bg-border mx-1" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Lock size={12} />
              Internal Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <WalletMultiButtonDynamic className="!bg-surface !border !border-border hover:!border-primary/50 !text-text-main !transition-all !rounded-xl !font-mono !text-xs !px-4 !h-9" />
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-text-muted text-xs font-semibold transition-all"
            >
              <LogOut size={14} />
              Lock
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. AUTHENTICATION GATE (When not authenticated) */}
      {/* ========================================================================= */}
      {!isAuthenticated ? (
        <main className="min-h-[85vh] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <ShieldAlert size={120} className="text-primary" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl w-fit">
                  <ShieldAlert size={28} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-text-main">
                  Restricted Control Center
                </h2>
                <p className="text-text-muted text-xs leading-relaxed">
                  This interface requires dual-layer authorization: an authorized Solana wallet signature plus the Master Admin Secret.
                </p>
              </div>

              {authError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 font-medium leading-relaxed">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted font-medium mb-1.5 uppercase">
                    Admin Wallet
                  </label>
                  <div className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-mono text-text-main flex items-center justify-between">
                    <span>
                      {connected && walletAddress
                        ? `${walletAddress.substring(0, 10)}...${walletAddress.slice(-8)}`
                        : "No Wallet Connected"}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        connected ? "bg-emerald-400 animate-pulse" : "bg-text-muted"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted font-medium mb-1.5 uppercase">
                    Master Admin Passphrase
                  </label>
                  <input
                    type="password"
                    placeholder="Enter admin secret..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading || !connected}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_0_25px_rgba(79,70,229,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Verifying Signature...
                    </>
                  ) : (
                    <>
                      <Unlock size={16} />
                      Sign & Authenticate
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-border/50 text-[11px] text-text-muted font-mono text-center">
                Strict Zero-Trust Policy Active • End-to-End Logged
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ========================================================================= */
        /* 2. AUTHENTICATED ADMIN DASHBOARD */
        /* ========================================================================= */
        <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface border border-border p-6 rounded-3xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-2xl font-heading font-bold text-text-main">
                  Platform Operations & Health
                </h1>
              </div>
              <p className="text-text-muted text-xs font-mono">
                Authenticated Admin:{" "}
                <span className="text-primary font-semibold">{adminSession?.wallet}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchMetrics}
                disabled={dataLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surfaceHover border border-border text-text-main text-xs font-semibold hover:border-primary/50 transition-all"
              >
                <RefreshCw size={14} className={dataLoading ? "animate-spin text-primary" : ""} />
                Refresh Telemetry
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border gap-2">
            {[
              { id: "overview", label: "Platform Overview", icon: Activity },
              { id: "rpc-tests", label: "Upstream RPC Health Suite", icon: Zap },
              { id: "users", label: "User & Key Directory", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-xs transition-all ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-text-muted hover:text-text-main"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-xs font-mono uppercase font-medium">Registered Users</span>
                    <Users size={20} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-text-main">
                    {telemetry?.totalUsers ?? 0}
                  </h3>
                  <p className="text-[11px] text-text-muted">Unique Solana Wallets</p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-xs font-mono uppercase font-medium">Secret API Keys</span>
                    <Key size={20} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-text-main">
                    {telemetry?.totalKeys ?? 0}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-emerald-400">{telemetry?.activeKeys ?? 0} Active</span>
                    <span className="text-rose-400">{telemetry?.revokedKeys ?? 0} Revoked</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-xs font-mono uppercase font-medium">Proxy Requests</span>
                    <Activity size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-text-main">
                    {telemetry?.totalRequests.toLocaleString() ?? "0"}
                  </h3>
                  <p className="text-[11px] text-text-muted">Processed through Go Engine</p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-xs font-mono uppercase font-medium">Error Rate</span>
                    <Server size={20} className="text-amber-400" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-text-main">
                    {telemetry?.errorRate ?? "0.00%"}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Avg Latency: <span className="text-text-main font-semibold">{telemetry?.avgLatency ?? "0ms"}</span>
                  </p>
                </div>
              </div>

              {/* Plans Distribution & Infrastructure Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
                  <h4 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
                    <Database size={18} className="text-primary" />
                    Subscription Plan Distribution
                  </h4>
                  <div className="space-y-3">
                    {telemetry && Object.entries(telemetry.planCounts).length > 0 ? (
                      Object.entries(telemetry.planCounts).map(([planName, count]) => (
                        <div
                          key={planName}
                          className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl"
                        >
                          <span className="text-sm font-semibold text-text-main">{planName}</span>
                          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-mono font-bold">
                            {count} User{count > 1 ? "s" : ""}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-text-muted">
                        No registered users yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
                  <h4 className="text-base font-heading font-bold text-text-main flex items-center gap-2">
                    <Cpu size={18} className="text-emerald-400" />
                    Infrastructure Subsystems
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Database size={16} className="text-primary" />
                        <span className="font-semibold text-text-main">PostgreSQL / Supabase</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-mono font-semibold">
                        Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Server size={16} className="text-purple-400" />
                        <span className="font-semibold text-text-main">Go Proxy Failover Engine</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-mono font-semibold">
                        Ready (Port 8080)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Zap size={16} className="text-amber-400" />
                        <span className="font-semibold text-text-main">Upstream RPC Multi-Provider</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-mono font-semibold">
                        Matrixed Link + Solana
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPSTREAM RPC DIAGNOSTICS & KEY TEST */}
          {activeTab === "rpc-tests" && (
            <div className="space-y-6">
              <div className="bg-surface border border-border p-6 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                    <Zap size={20} className="text-primary" />
                    Upstream RPC Endpoint & API Key Benchmark
                  </h3>
                  <p className="text-text-muted text-xs mt-1">
                    Execute live JSON-RPC diagnostic requests directly against configured upstream providers (Matrixed Link, Fallback nodes, or custom URLs) to benchmark latency and verify authorization tokens.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedTarget("primary")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTarget === "primary"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-text-muted hover:border-border/80"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase">Target 1</div>
                    <div className="font-heading font-bold text-sm text-text-main mt-1">
                      Primary RPC (Matrixed Link)
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTarget("fallback")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTarget === "fallback"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-text-muted hover:border-border/80"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase">Target 2</div>
                    <div className="font-heading font-bold text-sm text-text-main mt-1">
                      Fallback Solana Cluster
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTarget("custom")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTarget === "custom"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-text-muted hover:border-border/80"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase">Target 3</div>
                    <div className="font-heading font-bold text-sm text-text-main mt-1">
                      Custom URL / Token Test
                    </div>
                  </button>
                </div>

                {selectedTarget === "custom" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-text-muted font-medium uppercase">
                      Custom RPC Endpoint URL (with auth token)
                    </label>
                    <input
                      type="text"
                      placeholder="https://eu.endpoints.matrixed.link/rpc/solana-devnet?auth=YOUR_TOKEN"
                      value={customRpcUrl}
                      onChange={(e) => setCustomRpcUrl(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-text-main placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={runRpcDiagnostic}
                    disabled={testLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-50"
                  >
                    {testLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Running Diagnostics...
                      </>
                    ) : (
                      <>
                        <Terminal size={14} />
                        Execute Live Benchmark
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Diagnostic Results Display */}
              {diagnosticResult && (
                <div className="bg-surface border border-border p-6 rounded-3xl space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-heading font-bold text-text-main">
                        Diagnostic Evaluation Output
                      </h4>
                      <p className="text-xs font-mono text-text-muted break-all">
                        Target: {diagnosticResult.targetUrl}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
                        diagnosticResult.status === "online"
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                          : diagnosticResult.status === "degraded"
                          ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                          : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
                      }`}
                    >
                      {diagnosticResult.status === "online" && <CheckCircle2 size={14} />}
                      {diagnosticResult.status === "degraded" && <AlertTriangle size={14} />}
                      {diagnosticResult.status === "offline" && <XCircle size={14} />}
                      {diagnosticResult.status}
                    </span>
                  </div>

                  {diagnosticResult.error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                      {diagnosticResult.error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                      <span className="text-[11px] font-mono text-text-muted uppercase">Roundtrip Latency</span>
                      <div className="text-xl font-heading font-bold text-emerald-400">
                        {diagnosticResult.latencyMs}ms
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                      <span className="text-[11px] font-mono text-text-muted uppercase">HTTP Status</span>
                      <div className="text-xl font-heading font-bold text-text-main">
                        {diagnosticResult.httpStatus || 200}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                      <span className="text-[11px] font-mono text-text-muted uppercase">Node Version</span>
                      <div className="text-sm font-mono font-semibold text-text-main truncate">
                        {diagnosticResult.nodeVersion || "N/A"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                      <span className="text-[11px] font-mono text-text-muted uppercase">Synced Slot</span>
                      <div className="text-xl font-heading font-bold text-text-main">
                        {diagnosticResult.currentSlot ? diagnosticResult.currentSlot.toLocaleString() : "Synced"}
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON-RPC Response Inspector */}
                  {Boolean(diagnosticResult.rawResponse) && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-text-muted font-medium uppercase">
                        Raw JSON-RPC Node Response
                      </span>
                      <pre className="bg-background border border-border p-4 rounded-2xl text-xs font-mono text-text-muted overflow-x-auto max-h-64">
                        {JSON.stringify(diagnosticResult.rawResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER & KEY DIRECTORY */}
          {activeTab === "users" && (
            <div className="space-y-8">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Filter by wallet address, key name, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-border rounded-2xl pl-11 pr-4 py-3 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Registered Wallets Table */}
              <div className="space-y-3">
                <h3 className="text-base font-heading font-bold text-text-main">
                  Registered Wallets ({filteredUsers.length})
                </h3>
                <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-surfaceHover/50 border-b border-border text-text-muted text-xs font-mono uppercase">
                      <tr>
                        <th className="px-6 py-3.5">WALLET ADDRESS</th>
                        <th className="px-6 py-3.5">PLAN</th>
                        <th className="px-6 py-3.5">FIRST SEEN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-surfaceHover/30 transition-colors font-mono">
                            <td className="px-6 py-4 font-semibold text-text-main">
                              {u.wallet_address}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
                                {u.plan}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-text-muted">
                              {new Date(u.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-text-muted font-sans">
                            No registered users match your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Generated API Keys Table */}
              <div className="space-y-3">
                <h3 className="text-base font-heading font-bold text-text-main">
                  Active Secret Keys ({filteredKeys.length})
                </h3>
                <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-surfaceHover/50 border-b border-border text-text-muted text-xs font-mono uppercase">
                      <tr>
                        <th className="px-6 py-3.5">KEY NAME</th>
                        <th className="px-6 py-3.5">MASKED VALUE</th>
                        <th className="px-6 py-3.5">OWNER WALLET</th>
                        <th className="px-6 py-3.5">STATUS</th>
                        <th className="px-6 py-3.5">CREATED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {filteredKeys.length > 0 ? (
                        filteredKeys.map((k) => (
                          <tr key={k.id} className="hover:bg-surfaceHover/30 transition-colors font-mono">
                            <td className="px-6 py-4 font-sans font-semibold text-text-main">
                              {k.name}
                            </td>
                            <td className="px-6 py-4 text-text-muted">
                              <code className="bg-background px-2.5 py-1 rounded border border-border">
                                {k.masked_key}
                              </code>
                            </td>
                            <td className="px-6 py-4 text-text-muted truncate max-w-xs">
                              {k.user_wallet}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  k.status === "active"
                                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                                    : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
                                }`}
                              >
                                {k.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-text-muted">
                              {new Date(k.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-text-muted font-sans">
                            No API keys match your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
