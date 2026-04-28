"use client";

import { 
  Bell, 
  Eye, 
  Key, 
  Lock, 
  Mail, 
  Shield, 
  User, 
  Wallet 
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="mono-label text-primary mb-2">Account Management</p>
          <h1 className="text-4xl">Platform Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-2">
           <p className="mono-label px-2 mb-4">Categories</p>
           {[
              { name: "Profile", icon: User, active: true },
              { name: "Security", icon: Shield },
              { name: "Notifications", icon: Bell },
              { name: "Connected Apps", icon: Key },
           ].map((item) => (
              <button 
                key={item.name} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  item.active ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-text-muted hover:bg-white hover:text-text-main"
                }`}
              >
                 <item.icon size={18} />
                 {item.name}
              </button>
           ))}
        </aside>

        <div className="md:col-span-3 space-y-8">
           {/* Profile Section */}
           <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-border premium-shadow stagger-in">
              <h3 className="text-xl mb-8">Personal Information</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-text-muted ml-1">Display Name</label>
                       <input type="text" defaultValue="Marvelous" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-text-muted ml-1">Email Address</label>
                       <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input type="email" defaultValue="marvelous@ilyrium.infra" className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-all" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted ml-1">Bio / Organization</label>
                    <textarea rows={3} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all resize-none">Ilyrium Core Infrastructure Lead</textarea>
                 </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-border flex justify-end gap-3">
                 <button className="btn-secondary">Discard</button>
                 <button className="btn-primary">Save Changes</button>
              </div>
           </div>

           {/* Web3 Security Section */}
           <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-border premium-shadow">
              <div className="flex items-start justify-between mb-8">
                 <div>
                    <h3 className="text-xl mb-1">Web3 Security</h3>
                    <p className="text-sm text-text-muted">Manage your connected Solana wallets and authentication keys.</p>
                 </div>
                 <div className="p-3 bg-accent-blue/5 rounded-2xl text-accent-blue">
                    <Wallet size={24} />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-border">
                          <Shield size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold">Phantom Wallet</p>
                          <p className="text-xs text-text-muted">7x8h...k9m (Last used 2m ago)</p>
                       </div>
                    </div>
                    <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Disconnect</button>
                 </div>

                 <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text-muted border border-border">
                          <Lock size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold">Two-Factor Authentication</p>
                          <p className="text-xs text-text-muted">Secure your account with TOTP or SMS.</p>
                       </div>
                    </div>
                    <button className="text-xs font-bold text-primary">Enable 2FA</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
