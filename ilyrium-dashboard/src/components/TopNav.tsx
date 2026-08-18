"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// WalletMultiButton must be dynamically imported with ssr: false to avoid hydration mismatch
const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod: any) => mod.WalletMultiButton || mod.default?.WalletMultiButton || mod.default
    ),
  { ssr: false }
) as React.ComponentType<{ className?: string }>;

export const TopNav = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/dashboard/api-keys") return "API Keys";
    if (pathname === "/dashboard/billing") return "Billing";
    return "Dashboard";
  };

  return (
    <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 text-text-muted hover:text-text-main transition-colors"
          onClick={() => onMenuClick?.()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <h2 className="text-xl font-heading font-semibold text-text-main">
          {getPageTitle()}
        </h2>
      </div>
      <div>
        <WalletMultiButtonDynamic className="!bg-primary hover:!bg-primary/90 !transition-all !rounded-xl !font-body !font-semibold !px-6 !h-11" />
      </div>
    </header>
  );
};
