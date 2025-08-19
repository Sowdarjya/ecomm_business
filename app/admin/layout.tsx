import type React from "react";
import { AdminSidebar } from "@/components/Sidebar";
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
