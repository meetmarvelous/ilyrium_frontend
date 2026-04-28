"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 text-center max-w-lg animate-float">
        <div className="flex justify-center mb-12">
          <Logo className="w-16 h-16" showText={false} />
        </div>

        <h1 className="text-[120px] font-black text-primary/10 leading-none mb-4">404</h1>
        <h2 className="text-4xl font-black mb-6">Lost in the Network</h2>
        <p className="text-lg text-text-muted mb-12">
          The node you're looking for doesn't exist or has been migrated. Let's get you back to the hub.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
            <Home size={18} />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-24 flex items-center gap-6 text-[10px] mono text-text-muted/50">
        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-green" /> All Systems Nominal</span>
        <span>&copy; 2024 ILYRIUM INFRA</span>
      </div>
    </div>
  );
}
