"use client";
import { Button } from "../../components/ui/Button";
import { Dialog } from "@headlessui/react";

export default function PlanModal({ userName, plans, onClose }) {
  if (!userName) return null;

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold">
            แผนของ {userName}
          </Dialog.Title>

          <ul className="space-y-3 max-h-[400px] overflow-y-auto">
            {plans.map((plan, i) => (
              <li key={i} className="border p-3 rounded-lg space-y-2">
                <div>📝 {plan.title}</div>
                <div>
                  📅{" "}
                  {plan.date
                    ? new Date(plan.date).toISOString().split("T")[0]
                    : "-"}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              ปิด
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
