"use client";

import { 
  Code2, 
  Download, 
  Filter, 
  Search, 
  Terminal 
} from "lucide-react";

const logs = [
  { id: 1, timestamp: "2024-04-28 15:42:01", method: "GET", path: "/v1/rpc/solana-mainnet", status: 200, latency: "2.4ms" },
  { id: 2, timestamp: "2024-04-28 15:41:58", method: "POST", path: "/v1/rpc/solana-mainnet", status: 200, latency: "1.8ms" },
  { id: 3, timestamp: "2024-04-28 15:41:45", method: "GET", path: "/v1/rpc/solana-mainnet", status: 429, latency: "0.5ms" },
  { id: 4, timestamp: "2024-04-28 15:40:12", method: "GET", path: "/v1/rpc/solana-mainnet", status: 200, latency: "3.2ms" },
  { id: 5, timestamp: "2024-04-28 15:38:55", method: "POST", path: "/v1/rpc/solana-mainnet", status: 200, latency: "2.1ms" },
];

export default function LogsPage() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Real-time Traffic</p>
          <h1 className="text-4xl">Usage Logs</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download size={18} />
            Export CSV
          </button>
          <button className="btn-primary">
            <Terminal size={18} />
            Live Stream
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-border premium-shadow overflow-hidden">
        <div className="p-6 border-b border-border bg-surface/30 flex flex-col sm:flex-row items-center gap-4">
           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-border flex-1 w-full sm:w-auto">
              <Search size={16} className="text-text-muted" />
              <input type="text" placeholder="Filter by path or status..." className="bg-transparent outline-none text-sm w-full" />
           </div>
           <button className="btn-secondary py-2 h-auto text-xs w-full sm:w-auto">
              <Filter size={14} />
              Advanced Filters
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="px-8 py-5 mono-label">Timestamp</th>
                <th className="px-8 py-5 mono-label">Method</th>
                <th className="px-8 py-5 mono-label">Request Path</th>
                <th className="px-8 py-5 mono-label">Status</th>
                <th className="px-8 py-5 mono-label text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface/30 transition-colors group">
                  <td className="px-8 py-6 text-text-muted">{log.timestamp}</td>
                  <td className="px-8 py-6">
                    <span className={`font-bold ${log.method === "POST" ? "text-primary" : "text-accent-blue"}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-semibold">{log.path}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-lg ${
                      log.status === 200 ? "bg-accent-green/10 text-accent-green" : "bg-red-500/10 text-red-500"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-text-main">
                    {log.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-border flex items-center justify-between bg-surface/10">
           <p className="text-xs text-text-muted">Showing last 50 requests</p>
           <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border bg-white text-[10px] font-bold disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1.5 rounded-lg border border-border bg-white text-[10px] font-bold">Next Page</button>
           </div>
        </div>
      </div>

      <div className="bg-text-main rounded-[32px] p-8 lg:p-12 text-white premium-shadow relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Code2 size={200} />
         </div>
         <div className="relative z-10">
            <h3 className="text-2xl mb-4">Integrate Ilyrium via CLI</h3>
            <p className="text-white/60 mb-8 max-w-xl">
               Get real-time log streaming directly in your terminal using our developer SDK. Monitor latency and route diversion as it happens.
            </p>
            <div className="bg-white/10 rounded-2xl p-5 font-mono text-sm border border-white/10 backdrop-blur-md">
               <span className="text-primary-glow font-bold">$</span> npx ilyrium-cli logs --follow --region global
            </div>
         </div>
      </div>
    </div>
  );
}
