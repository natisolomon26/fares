// src/components/dashboard/DashboardLayout.tsx
import { ReactNode } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}