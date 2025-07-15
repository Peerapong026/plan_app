"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export default function EditPlanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState({ title: "", date: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/edit/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlan({
            title: data.data.title,
            date: data.data.date.split("T")[0],
          });
        } else {
          toast.error("ไม่พบแผน");
          router.push("/plan_calendar");
        }
      });
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("บันทึกสำเร็จ");
        router.push("/plan_calendar");
      } else {
        toast.error("บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-extrabold text-purple-700 mb-6 text-center flex items-center justify-center gap-2">
      <Pencil className="w-6 h-6" /> แก้ไขแพลนงาน
        </h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">ชื่อกิจกรรม</label>
          <Input
            value={plan.title}
            onChange={(e) => setPlan({ ...plan, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">วันที่</label>
          <Input
            type="date"
            value={plan.date}
            onChange={(e) => setPlan({ ...plan, date: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            ย้อนกลับ
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}
