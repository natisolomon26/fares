// src/components/dashboard/members/MemberSummaryCards.tsx
"use client";

import { Users, User, Users2 } from "lucide-react";

interface MemberSummaryCardsProps {
  total: number;
  single: number;
  family: number;
}

export default function MemberSummaryCards({ total, single, family }: MemberSummaryCardsProps) {
  const cardData = [
    { title: "Total Members", count: total, icon: Users, color: "bg-blue-100", textColor: "text-blue-700" },
    { title: "Single Members", count: single, icon: User, color: "bg-green-100", textColor: "text-green-700" },
    { title: "Family Members", count: family, icon: Users2, color: "bg-purple-100", textColor: "text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-secondary">{card.title}</p>
              <p className="text-xl font-semibold text-text-primary">{card.count}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
