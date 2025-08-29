"use client";

import type React from "react";
import { useState } from "react";
import { AdminSidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50/30 flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-6 md:ml-64 w-full">
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200"
          >
            <Menu className="h-6 w-6 text-amber-900" />
          </button>
          <h1 className="text-lg font-semibold text-amber-900">Admin</h1>
        </div>

        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
