"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Activity, Clock, AlertTriangle, Key, Loader2 } from "lucide-react";

interface Stats {
  totalRequests: number | string;
  avgLatency: string;
  errorRate: string;
  activeKeys: number;
}

export default function DashboardOverview() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const walletAddress = publicKey?.toBase58() || "";

  const fetchStats = useCallback(async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/usage", {
        headers: { "x-wallet-address": walletAddress },
      });
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      // Supabase not connected — use defaults
      setStats({
        totalRequests: 0,
        avgLatency: "0.00ms",
        errorRate: "0.00%",
        activeKeys: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Activity size={48} className="text-primary/50 mb-4" />
        <h3 className="text-xl font-heading font-semibold text-text-main mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-text-muted max-w-sm">
          Connect a Solana wallet to view your RPC usage statistics and manage your infrastructure.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Requests (24h)",
      value: stats ? String(stats.totalRequests) : "0",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "Avg Latency",
      value: stats?.avgLatency || "0.00ms",
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      name: "Error Rate",
      value: stats?.errorRate || "0.00%",
      icon: AlertTriangle,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
    {
      name: "Active Keys",
      value: stats ? String(stats.activeKeys) : "0",
      icon: Key,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="p-6 rounded-2xl bg-surface border border-border flex items-start justify-between hover:border-primary/50 transition-colors"
            >
              <div>
                <p className="text-text-muted font-medium mb-2 text-sm">{stat.name}</p>
                <h3 className="text-3xl font-heading font-bold text-text-main">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-2xl bg-surface border border-border h-96 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 text-center">
          <Activity size={48} className="text-primary/50 mx-auto mb-4" />
          <h4 className="text-xl font-heading font-semibold text-text-main mb-2">
            Real-time Traffic
          </h4>
          <p className="text-text-muted max-w-sm">
            Detailed RPC request visualization will appear here once your endpoint receives traffic.
          </p>
        </div>
      </div>
    </div>
  );
}
