"use client";

import { 
  Copy, 
  Eye, 
  Key,
  MoreVertical, 
  Plus, 
  RotateCcw, 
  Trash2,
  ShieldCheck,
  Zap,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

const initialKeys = [
  { id: 1, name: "Production - Main App", key: "ily_live_7x8h2k9m...", status: "Active", created: "2024-04-12", usage: "1.2M req" },
  { id: 2, name: "Development - Staging", key: "ily_test_4p1q5r0w...", status: "Active", created: "2024-04-15", usage: "45k req" },
  { id: 3, name: "Side Project - Analytics", key: "ily_live_9z3v1n4x...", status: "Revoked", created: "2024-03-28", usage: "0 req" },
];

export default function KeysPage() {
  const [keys, setKeys] = useState(initialKeys);

  return (
    <div className="space-y-12 stagger-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Access Control</p>
          <h1 className="text-4xl lg:text-5xl">API Keys</h1>
        </div>
        <button className="btn-primary py-4">
          <Plus size={18} />
          Create New Key
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-border premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="px-10 py-6 mono-label">Key Identity</th>
                <th className="px-10 py-6 mono-label">Token Secret</th>
                <th className="px-10 py-6 mono-label text-center">Status</th>
                <th className="px-10 py-6 mono-label text-right">30d Usage</th>
                <th className="px-10 py-6 mono-label text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((key) => (
                <tr key={key.id} className="group hover:bg-surface/30 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div>
                       <p className="font-black text-text-main text-lg mb-1">{key.name}</p>
                       <p className="text-[10px] mono text-text-muted">Created {key.created}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3 bg-surface px-4 py-2.5 rounded-xl border border-border w-fit font-mono text-xs group-hover:border-primary/30 transition-colors">
                      {key.key}
                      <button className="text-text-muted hover:text-primary transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full inline-block ${
                      key.status === "Active" 
                        ? "bg-accent-green/10 text-accent-green" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right font-bold text-text-muted">
                    {key.usage}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button title="View Details" className="p-3 rounded-2xl hover:bg-white hover:text-primary border border-transparent hover:border-border transition-all">
                        <Eye size={18} />
                      </button>
                      <button title="Rotate Key" className="p-3 rounded-2xl hover:bg-white hover:text-primary border border-transparent hover:border-border transition-all">
                        <RotateCcw size={18} />
                      </button>
                      <button title="Delete Key" className="p-3 rounded-2xl hover:bg-red-50 text-red-500 border border-transparent hover:border-red-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-primary/5 rounded-[40px] p-10 border border-primary/10 flex items-start gap-8 group">
            <div className="p-5 bg-white rounded-3xl premium-shadow text-primary group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black mb-3">Security Protocol</h4>
               <p className="text-sm text-text-muted leading-relaxed font-medium">
                  Ilyrium keys are encrypted at rest using industry-standard AES-256. Never expose your live keys in client-side applications. Use our regional proxies to secure your infrastructure.
               </p>
            </div>
         </div>

         <div className="bg-text-main rounded-[40px] p-10 border border-white/5 flex items-start gap-8 group">
            <div className="p-5 bg-white/10 rounded-3xl text-primary group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md border border-white/10">
               <Zap size={32} />
            </div>
            <div className="text-white">
               <h4 className="text-xl font-black mb-3 text-white">Edge Performance</h4>
               <p className="text-sm text-white/60 leading-relaxed font-medium">
                  Each API key automatically utilizes our global edge network. No extra configuration required for regional failover or intelligent routing.
               </p>
               <Link href="/dashboard/nodes" className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-xs hover:underline">
                  View Node Map <ExternalLink size={14} />
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}

import Link from "next/link";
