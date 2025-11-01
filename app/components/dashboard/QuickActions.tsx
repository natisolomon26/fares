// src/components/dashboard/QuickActions.tsx
import { Users, DoorOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 flex flex-col sm:flex-row gap-4"
    >
      <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow">
        <Users className="w-5 h-5" />
        Add New Member
      </button>
      <button className="flex-1 bg-white border border-gray-300 text-text-primary hover:bg-gray-50 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
        <DoorOpen className="w-5 h-5" />
        Submit Leave Request
      </button>
    </motion.div>
  );
}