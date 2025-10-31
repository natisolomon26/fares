// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";

// Simulate auth check
function useAuth() {
  const router = useRouter();
  useEffect(() => {
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);
}

export default function DashboardPage() {
  useAuth();

  // Mock data
  const stats = [
    { label: "Total Members", value: "1,248" },
    { label: "Active This Month", value: "982" },
    { label: "Pending Leaving Requests", value: "3" },
  ];

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Welcome back, Pastor Michael</h2>
        <p className="text-text-secondary mb-8">
          Here’s a quick overview of your church community.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-text-secondary text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard/members/new")}
              className="px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Add New Member
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard/leaving-requests/new")}
              className="px-5 py-3 bg-white border border-gray-300 text-text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Submit Leaving Request
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}