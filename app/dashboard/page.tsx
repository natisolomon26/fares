// app/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import { Church } from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import DashboardCard from "@/app/components/dashboard/DashboardCard";
import GrowthChart from "@/app/components/dashboard/GrowthChart";
import QuickActions from "@/app/components/dashboard/QuickActions";
import { Users, HeartHandshake, DoorOpen, Calendar } from "lucide-react";

// Mock data (replace with real DB later)
const stats = [
  { label: "Total Members", value: "1,248", icon: Users, color: "#3b82f6" },
  { label: "Active This Month", value: "982", icon: HeartHandshake, color: "#10b981" },
  { label: "Pending Leave Requests", value: "3", icon: DoorOpen, color: "#f59e0b" },
  { label: "Events This Month", value: "12", icon: Calendar, color: "#8b5cf6" },
];

const monthlyData = [
  { month: "Jan", members: 1100 },
  { month: "Feb", members: 1150 },
  { month: "Mar", members: 1180 },
  { month: "Apr", members: 1210 },
  { month: "May", members: 1230 },
  { month: "Jun", members: 1248 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Church className="w-8 h-8 text-primary-600" />
            Church Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            Welcome back! Here’s an overview of your community.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((stat, i) => (
            <DashboardCard key={i} {...stat} />
          ))}
        </motion.div>

        {/* Chart */}
        <GrowthChart data={monthlyData} />

        {/* Actions */}
        <QuickActions />
      </div>
    </DashboardLayout>
  );
}