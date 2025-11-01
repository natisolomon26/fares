// src/components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  DoorOpen,
  User,
  Church,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Members", href: "/member", icon: Users },
  { name: "Leave Requests", href: "/dashboard/leave-requests", icon: DoorOpen },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Setting", href: "/dashboard/setting", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary-600 border-r border-gray-100 hidden md:block">
      <div className="p-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
            <Church className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">
            Grace<span className="text-primary-600">MS</span>
          </span>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-l-2 border-primary-500 font-medium"
                      : "text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary-600" : "text-text-secondary group-hover:text-text-primary"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout at bottom */}
      <div className="absolute bottom-6 w-full px-4">
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full text-left text-text-secondary hover:text-red-600 p-3 rounded-lg transition-colors flex items-center space-x-3"
          >
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}