"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// WalletMultiButton must be dynamically imported with ssr: false to avoid hydration mismatch
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const TopNav = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/dashboard/api-keys") return "API Keys";
    if (pathname === "/dashboard/billing") return "Billing";
    return "Dashboard";
  };

  return (
    <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div>
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
