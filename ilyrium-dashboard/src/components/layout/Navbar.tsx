"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import WalletConnect from "./WalletConnect";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-muted hover:text-primary transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-4 bg-surface px-4 py-2.5 rounded-2xl border border-border group focus-within:border-primary transition-all w-80 lg:w-96">
          <Search size={18} className="text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search network..." 
            className="bg-transparent border-none outline-none text-sm w-full font-body text-text-main placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="hidden sm:block">
          <WalletConnect />
        </div>

        <button className="relative p-2.5 text-text-muted hover:text-primary bg-surface rounded-xl border border-border hover:border-primary transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-blue rounded-full ring-2 ring-white animate-pulse" />
        </button>

        <div className="h-8 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-black text-text-main leading-tight">Marvelous</p>
            <p className="text-[10px] mono text-primary">Pro Admin</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary overflow-hidden group-hover:border-primary transition-all">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
