"use client";

import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { CheckCircle2, Zap, Rocket, Loader2, ExternalLink, AlertCircle } from "lucide-react";

export default function BillingPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [activePlanSlug, setActivePlanSlug] = useState<string>("developer");
  const [subscribingSlug, setSubscribingSlug] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const plans = [
    {
      name: "Developer",
      slug: "developer",
      price: "Free",
      priceSol: 0,
      description: "Perfect for testing and small projects.",
      icon: Zap,
      features: [
        "100,000 Requests / day",
        "Standard Support",
        "Shared Nodes",
        "Community Discord",
      ],
    },
    {
      name: "Pro Tier",
      slug: "pro",
      price: "2.5 SOL",
      priceSol: 2.5,
      period: "/ month",
      description: "For production applications requiring scale.",
      icon: Rocket,
      features: [
        "Unlimited Requests",
        "Priority 24/7 Support",
        "Dedicated Nodes",
        "Custom Rate Limits",
      ],
    },
  ];

  const handleSubscribe = async (planSlug: string, priceSol: number) => {
    if (planSlug === activePlanSlug) return;
    setErrorMessage(null);
    setTxSignature(null);

    if (!publicKey) {
      setErrorMessage("Please connect your Solana wallet first.");
      return;
    }

    if (priceSol === 0) {
      setActivePlanSlug("developer");
      setStatusMessage("Switched back to Developer Free Tier.");
      return;
    }

    try {
      setSubscribingSlug(planSlug);
      setStatusMessage("Preparing Solana transaction...");

      // Destination Treasury Wallet
      const treasuryAddress =
        process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS ||
        "11111111111111111111111111111111";

      const treasuryPubKey = new PublicKey(treasuryAddress);

      // Create SOL Transfer Transaction
      const lamports = Math.round(priceSol * LAMPORTS_PER_SOL);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubKey,
          lamports,
        })
      );

      // Fetch recent blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      setStatusMessage("Awaiting wallet approval...");

      // Send transaction prompt to user's connected wallet
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      setStatusMessage("Transaction submitted! Confirming on-chain...");

      // Confirm transaction on Solana network
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      setStatusMessage("On-chain transfer confirmed! Upgrading subscription...");

      // Notify backend API to register/verify plan upgrade
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": publicKey.toBase58(),
        },
        body: JSON.stringify({
          planSlug,
          signature,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActivePlanSlug(planSlug);
        setStatusMessage(`Successfully upgraded to ${planSlug.toUpperCase()} Tier!`);
      } else {
        setErrorMessage(data.error || "Subscription verification failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction rejected or failed.";
      setErrorMessage(msg);
    } finally {
      setSubscribingSlug(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h3 className="text-3xl font-heading font-bold text-text-main">
          Web3 Native Billing
        </h3>
        <p className="text-text-muted mt-3">
          Connect your wallet and upgrade your infrastructure instantly. Pay directly on-chain with zero hidden fees.
        </p>
      </div>

      {/* Transaction Notifications */}
      {statusMessage && (
        <div className="max-w-4xl mx-auto bg-primary/10 border border-primary/30 text-primary rounded-2xl p-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-3">
            {subscribingSlug ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400" />
            )}
            <span>{statusMessage}</span>
          </div>
          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline text-xs text-text-muted hover:text-text-main"
            >
              Explorer <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="max-w-4xl mx-auto bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl p-4 flex items-center gap-3 text-sm font-medium">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = activePlanSlug === plan.slug;
          const isSubscribing = subscribingSlug === plan.slug;

          return (
            <div
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-surface border-border"
                  : "bg-surface/80 border-primary/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:shadow-[0_0_60px_rgba(79,70,229,0.25)]"
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-surfaceHover border border-border text-text-muted text-xs font-semibold px-4 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              {!isCurrent && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-3 rounded-xl ${
                    isCurrent
                      ? "bg-surfaceHover text-text-muted"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-text-main">
                    {plan.name}
                  </h4>
                  <p className="text-text-muted text-sm">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-heading font-black text-text-main">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-text-muted font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-text-muted font-medium"
                  >
                    <CheckCircle2
                      size={20}
                      className={isCurrent ? "text-text-muted" : "text-primary"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.slug, plan.priceSol)}
                disabled={isCurrent || isSubscribing}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? "bg-surfaceHover text-text-muted cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
                }`}
              >
                {isSubscribing && <Loader2 size={18} className="animate-spin" />}
                {isCurrent
                  ? "Active Plan"
                  : isSubscribing
                  ? "Processing..."
                  : "Subscribe with Wallet"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
