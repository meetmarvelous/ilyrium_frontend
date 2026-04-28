"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Box, 
  Key, 
  LayoutDashboard, 
  LogOut, 
  Network, 
  Settings, 
  ShieldCheck, 
  Zap,
  X
} from "lucide-react";
import Logo from "./Logo";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Nodes & Routing", href: "/dashboard/nodes", icon: Network },
  { name: "API Keys", href: "/dashboard/keys", icon: Key },
  { name: "Usage Logs", href: "/dashboard/logs", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: ShieldCheck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-border z-50 transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <Logo />
            <button onClick={onClose} className="lg:hidden p-2 text-text-muted hover:text-primary">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="mono-label mb-6 px-4">Menu</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group
                    ${isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "text-text-muted hover:bg-surface hover:text-text-main"}
                  `}
                >
                  <item.icon size={20} className={`${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 mt-8 border-t border-border">
            <div className="p-6 rounded-3xl bg-surface/50 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={40} className="text-primary" />
              </div>
              <p className="text-[10px] font-bold text-primary mb-1 mono">Infrastructure</p>
              <h4 className="text-sm font-black mb-3">Scale with Ilyrium</h4>
              <Link 
                href="/dashboard/billing"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Upgrade Plan <Zap size={10} />
              </Link>
            </div>

            <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all mt-6 w-full">
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
