"use client";

import { 
  Check, 
  ChevronRight, 
  History, 
  Plus, 
  Wallet,
  Zap,
  ArrowUpRight,
  Shield
} from "lucide-react";

const plans = [
  { 
    name: "Foundation", 
    price: "0", 
    description: "Perfect for exploring the network",
    features: ["50,000 Requests/mo", "Single Region", "Community Support", "Standard Latency"],
    cta: "Current Tier",
    current: true
  },
  { 
    name: "Scale", 
    price: "99", 
    description: "Built for high-performance dApps",
    features: ["2.5M Requests/mo", "Multi-Region Edge", "Priority Support", "Sub-3ms Latency", "Advanced Analytics"],
    cta: "Upgrade to Scale",
    current: false,
    highlight: true
  },
  { 
    name: "Infrastructure", 
    price: "Custom", 
    description: "Enterprise-grade reliability",
    features: ["Unlimited Requests", "Dedicated Nodes", "24/7 SLA Support", "Custom Smart Routing", "Dedicated Wallet Support"],
    cta: "Contact Sales",
    current: false
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-16 stagger-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Subscription & Assets</p>
          <h1 className="text-4xl lg:text-5xl">Plans & Billing</h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-2.5 rounded-[24px] border border-border premium-shadow group cursor-pointer hover:border-primary transition-all">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <Wallet size={24} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] mono text-text-muted">Active Wallet</p>
            <p className="text-sm font-black">7x8h...k9m</p>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`bg-white rounded-[48px] p-12 border ${
              plan.highlight ? "border-primary ring-1 ring-primary/10 shadow-2xl shadow-primary/10" : "border-border shadow-soft"
            } flex flex-col relative group transition-all duration-500 hover:translate-y-[-8px]`}
          >
            {plan.highlight && (
              <span className="absolute -top-4 left-12 bg-primary text-white px-5 py-1.5 rounded-full text-[10px] mono font-bold shadow-xl shadow-primary/20">
                RECOMMENDED
              </span>
            )}
            
            <div className="mb-10">
               <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
               <p className="text-sm text-text-muted font-medium mb-8">{plan.description}</p>
               <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && <span className="text-2xl font-bold text-text-muted">$</span>}
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-text-muted text-sm font-bold ml-2">/month</span>}
               </div>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="mono-label">Includes</p>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-sm font-bold text-text-main/80">
                    <div className="w-6 h-6 rounded-lg bg-accent-green/10 text-accent-green flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button className={`w-full py-5 rounded-[24px] font-black text-sm transition-all duration-300 ${
              plan.current 
                ? "bg-surface text-text-muted cursor-not-allowed border border-border" 
                : "bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]"
            }`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment History Section */}
      <div className="space-y-8 pt-12 border-t border-border">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl premium-shadow border border-border">
                 <History size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black">Transaction Ledger</h3>
           </div>
           <button className="text-sm font-bold text-primary hover:underline">Download Invoices</button>
        </div>

        <div className="bg-white rounded-[40px] border border-border premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="px-10 py-6 mono-label">Transaction Date</th>
                  <th className="px-10 py-6 mono-label">Plan Tier</th>
                  <th className="px-10 py-6 mono-label">Blockchain Network</th>
                  <th className="px-10 py-6 mono-label">Amount Paid</th>
                  <th className="px-10 py-6 mono-label text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {[
                  { date: "April 12, 2024", plan: "Scale Tier", network: "Solana Mainnet", amount: "99.00 USDC", status: "Verified" },
                  { date: "March 12, 2024", plan: "Scale Tier", network: "Solana Mainnet", amount: "99.00 USDC", status: "Verified" },
                  { date: "February 12, 2024", plan: "Scale Tier", network: "Solana Mainnet", amount: "99.00 USDC", status: "Verified" },
                ].map((tx, i) => (
                  <tr key={i} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-10 py-8 text-sm text-text-main font-bold">{tx.date}</td>
                    <td className="px-10 py-8 text-sm text-text-muted">{tx.plan}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-xs font-bold text-accent-blue bg-accent-blue/5 px-4 py-2 rounded-xl w-fit border border-accent-blue/10">
                        <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                        {tx.network}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-text-main">{tx.amount}</td>
                    <td className="px-10 py-8 text-right">
                      <span className="text-[10px] font-black px-4 py-2 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/10 uppercase tracking-widest">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-text-main rounded-[40px] p-12 text-white premium-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={200} />
         </div>
         <div className="relative z-10 max-w-xl">
            <h3 className="text-3xl font-black mb-4">Solana-Native Billing</h3>
            <p className="text-white/60 font-medium">
               All Ilyrium subscriptions are settled on the Solana blockchain for transparency and security. Connect your wallet to manage recurring payments and view immutable receipts.
            </p>
         </div>
         <button className="btn-primary py-5 px-12 text-lg relative z-10">
            Connect Billing Wallet
            <ArrowUpRight size={20} />
         </button>
      </div>
    </div>
  );
}
