import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuToggle={() => setMobileSidebarOpen((open) => !open)} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
