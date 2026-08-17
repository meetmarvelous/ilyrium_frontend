"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { LayoutDashboard, Key, CreditCard, LogOut, X } from "lucide-react";
import Logo from "@/components/layout/Logo";

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) => {
  const pathname = usePathname();
  const { disconnect, connected } = useWallet();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside className={`w-64 border-r border-border bg-surface/90 backdrop-blur-md h-screen fixed left-0 top-0 flex flex-col transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" onClick={() => setIsOpen?.(false)}>
            <Logo className="w-7 h-7" showText={true} />
          </Link>
          <button 
            className="md:hidden text-text-muted hover:text-text-main"
            onClick={() => setIsOpen?.(false)}
          >
            <X size={24} />
          </button>
        </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen?.(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  : "text-text-muted hover:text-text-main hover:bg-surfaceHover"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : ""} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      {connected && (
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => disconnect()}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={20} />
            Disconnect
          </button>
        </div>
      )}
      </aside>
    </>
  );
};
