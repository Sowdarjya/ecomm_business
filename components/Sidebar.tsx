"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Users, X } from "lucide-react";

const sidebarItems = [
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-amber-200 shadow-sm">
        <SidebarContent pathname={pathname} />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />

          <div className="w-64 bg-white h-full shadow-lg p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100"
            >
              <X className="h-5 w-5 text-amber-900" />
            </button>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-amber-900 mb-6">
        Admin Dashboard
      </h2>
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
