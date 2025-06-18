"use client";
import React from "react";
import { X } from "lucide-react";

export default function PlanModal({ userName, plans, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-indigo-600 mb-4">
          📋 รายการแพลนของ {userName}
        </h2>

        {plans.length === 0 ? (
          <p className="text-gray-500">ไม่พบแพลน</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {plans.map((plan, index) => (
              <li key={index} className="bg-indigo-50 p-3 rounded-lg">
                <div className="font-semibold text-indigo-700">{plan.title}</div>
                <div className="text-sm text-gray-600">
                  วันที่:{" "}
                  {plan.date
                    ? new Date(plan.date).toISOString().split("T")[0]
                    : "-"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
