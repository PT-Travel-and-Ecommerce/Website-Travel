"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin, logoutAdmin, AdminUser } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MapPin,
  Star,
  LogOut,
  Menu,
  X,
  CreditCard,
  Route,
  TrendingUp,
  Receipt
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      router.push("/admin/login");
    } else {
      setAdmin(currentAdmin);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const menuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard/cities", icon: MapPin, label: "Cities" },
    { href: "/admin/dashboard/flight-routes", icon: Route, label: "Flight Routes" },
    { href: "/admin/dashboard/popular-routes", icon: TrendingUp, label: "Rute Populer" },
    { href: "/admin/dashboard/reviews", icon: Star, label: "Reviews" },
    { href: "/admin/dashboard/payments", icon: Receipt, label: "Kelola Pembayaran" },
    { href: "/admin/dashboard/payment-settings", icon: CreditCard, label: "Pengaturan Pembayaran" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl text-white font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">{admin.name}</p>
            <p className="text-xs text-gray-400">{admin.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
