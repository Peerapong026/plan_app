"use client";
import React from "react";
import { X, Pencil, Trash2 } from "lucide-react";


export default function PlanModal({ userName, plans, onClose }) {
  const handleEdit = (plan) => {
    // ✅ ตัวอย่าง: redirect ไปหน้าแก้ไข
    window.location.href = `/plan_calendar/edit/${plan._id}`;
  };

  const handleDelete = async (planId) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแผนนี้?")) return;

    try {
      const res = await fetch(`/api/delete/${planId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        alert("ลบแผนสำเร็จ");
        location.reload(); // reload เพื่ออัปเดตใหม่
      } else {
        alert("เกิดข้อผิดพลาดในการลบแผน");
      }
    } catch (error) {
      console.error("ลบไม่สำเร็จ", error);
      alert("ลบไม่สำเร็จ");
    }
  };

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
              <li
                key={index}
                className="bg-indigo-50 p-3 rounded-lg flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-indigo-700">{plan.title}</div>
                  <div className="text-sm text-gray-600">
                    วันที่:{" "}
                    {plan.date
                      ? new Date(plan.date).toISOString().split("T")[0]
                      : "-"}
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-blue-600 hover:text-blue-800"
                    title="แก้ไข"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-600 hover:text-red-800"
                    title="ลบ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
