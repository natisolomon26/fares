// src/components/dashboard/DashboardCard.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export default function DashboardCard({
  label,
  value,
  icon: Icon,
  color,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-secondary text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon 
            className="w-6 h-6" 
            style={{ color }} 
          />
        </div>
      </div>
    </motion.div>
  );
}