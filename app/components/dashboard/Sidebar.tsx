// src/components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Members", href: "/dashboard/members", icon: "👥" },
  { name: "Leaving Requests", href: "/dashboard/leaving-requests", icon: "🚪" },
  { name: "Reports", href: "/dashboard/reports", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-lg font-bold text-text-primary">GraceChurchMS</span>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-text-secondary hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout (simulated) */}
      <div className="absolute bottom-6 w-full px-4">
        <button
          onClick={() => {
            // TODO: Real logout logic
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/login";
          }}
          className="w-full text-left text-text-secondary hover:text-red-600 p-3 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}