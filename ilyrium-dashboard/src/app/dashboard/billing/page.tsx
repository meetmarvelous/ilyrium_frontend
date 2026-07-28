"use client";

import React from "react";
import { CheckCircle2, Zap, Rocket } from "lucide-react";

export default function BillingPage() {
  const plans = [
    {
      name: "Developer",
      price: "Free",
      description: "Perfect for testing and small projects.",
      icon: Zap,
      features: ["100,000 Requests / day", "Standard Support", "Shared Nodes", "Community Discord"],
      current: true,
    },
    {
      name: "Pro Tier",
      price: "2.5 SOL",
      period: "/ month",
      description: "For production applications requiring scale.",
      icon: Rocket,
      features: ["Unlimited Requests", "Priority 24/7 Support", "Dedicated Nodes", "Custom Rate Limits"],
      current: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h3 className="text-3xl font-heading font-bold text-text-main">Web3 Native Billing</h3>
        <p className="text-text-muted mt-3">Connect your wallet and upgrade your infrastructure instantly. No credit cards, no hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.current 
                ? "bg-surface border-border" 
                : "bg-surface/80 border-primary/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:shadow-[0_0_60px_rgba(79,70,229,0.25)]"
              }`}
            >
              {plan.current && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-surfaceHover border border-border text-text-muted text-xs font-semibold px-4 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              {!plan.current && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${plan.current ? 'bg-surfaceHover text-text-muted' : 'bg-primary/10 text-primary'}`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-text-main">{plan.name}</h4>
                  <p className="text-text-muted text-sm">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-heading font-black text-text-main">{plan.price}</span>
                {plan.period && <span className="text-text-muted font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-muted font-medium">
                    <CheckCircle2 size={20} className={plan.current ? "text-text-muted" : "text-primary"} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.current
                  ? "bg-surfaceHover text-text-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                }`}
              >
                {plan.current ? "Active" : "Subscribe with Wallet"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
