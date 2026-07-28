"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Key, CreditCard, LogOut } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface/50 backdrop-blur-md h-screen fixed left-0 top-0 flex flex-col transition-all z-40">
      <div className="h-20 flex items-center px-6 border-b border-border">
        <h1 className="font-heading font-black text-2xl tracking-tighter text-text-main">
          ILYRIUM
        </h1>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
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
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all font-medium">
          <LogOut size={20} />
          Disconnect
        </button>
      </div>
    </aside>
  );
};
