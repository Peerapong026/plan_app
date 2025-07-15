"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { CalendarDays, Pencil } from "lucide-react";

export default function AddPlanPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("/api/plan/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date,
        userid_name: user?.id_name || "",
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert("📅 บันทึกสำเร็จ!");
      router.push("/plan_calendar");
    } else {
      throw new Error(result.error || "ไม่สามารถบันทึกได้");
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    router.push("/login");
  } else if (user.role !== "member") {
    alert("เฉพาะสมาชิกเท่านั้นที่สามารถเพิ่มแพลนได้");
    router.push("/dashboard");
  }
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6 text-center flex items-center justify-center gap-2">
          <Pencil className="w-6 h-6" /> เพิ่มแพลนงาน
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อกิจกรรม</label>
            <input
              type="text"
              placeholder="เช่น ตรวจงาน Makro บางกะปิ 📢"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">วันที่</label>
            <div className="relative">
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 pr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {/* <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" /> */}
            </div>
            
          </div>
          <Button
            variant="default"
            className={`w-full py-2 rounded-lg ${(!title || !date || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={!title || !date || isLoading}
          >
            {isLoading ? '⏳ กำลังบันทึก...' : '✅ บันทึกแพลน'}
          </Button>
           <div className="flex justify-center mt-4">
            <Button
              variant="secondary"
              className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => router.push("/plan_calendar")}
            >
              🔙 ย้อนกลับ
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
