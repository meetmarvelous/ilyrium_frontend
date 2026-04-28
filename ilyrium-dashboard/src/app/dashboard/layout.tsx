"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="lg:pl-72 transition-all duration-500">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-6 lg:p-12 min-h-[calc(100vh-80px)] bg-surface/30 stagger-in">
          {children}
        </main>
      </div>
    </div>
  );
}
