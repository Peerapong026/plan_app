"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "../../components/ui/Card";
import { CardContent } from "../../components/ui/CardContent";
import { Button } from "../../components/ui/Button";
import { LogOut, CalendarDays, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Progress } from "../../components/ui/Progess";
import PlanModal from "../components/Planmodal";

export default function MyCalendarPage() {
  const [events, setEvents] = useState([]);
  const [planList, setPlanList] = useState([]); // ✅ แผนเต็มสำหรับ modal
  const [user, setUser] = useState(null);
  const router = useRouter();
  const calendarRef = useRef(null);
  const [mySummary, setMySummary] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "member") {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
  }, []);

    useEffect(() => {
      if (user) {
        fetchMyPlans(user.id_name, user.name);
      }
    }, [user, currentMonth]);

  const fetchMyPlans = async (id_name, name) => {
    try {
      const res = await fetch("/api/get/get-plan/");
      const result = await res.json();

      if (result.success) {
        const mine = result.data.filter((plan) => plan.id_name === id_name);

        setPlanList(mine); // ✅ เก็บแผนทั้งหมดไว้

        // 📅 ข้อมูลสำหรับปฏิทิน
        setEvents(
          mine.map((plan) => ({
            title: plan.title,
            start: new Date(plan.date).toISOString().split("T")[0],
          }))
        );

        const filteredThisMonth = mine.filter(plan => {
          const planDate = new Date(plan.date);
          return (
            planDate.getMonth() === currentMonth.getMonth() &&
            planDate.getFullYear() === currentMonth.getFullYear()
          );
        });

        const jobCount = filteredThisMonth.length;

        const progress = Math.min((jobCount / 30) * 100, 100); // 30 งาน = 100%

        setMySummary([
          {
            name: name || id_name,
            job: jobCount,
            progress: Math.round(progress),
          },
        ]);
      }
    } catch (err) {
      console.error("โหลดแผนของตัวเองล้มเหลว", err);
    }
  };

  const handleViewMyPlans = () => {
    const sorted = [...planList].sort(
      (a, b) => new Date(b.date) - new Date(a.date) // ใหม่ → เก่า
    );
    setSelectedPlans(sorted);
    setShowPlans(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/plan_team">
          <Button variant="info" className="flex items-center gap-2">
            <PlusCircle size={16} />
            เพิ่มแพลนของฉัน
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          📅 ปฏิทินของฉัน
        </h1>
        <Button
          variant="danger"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="flex items-center gap-2"
        >
          <LogOut size={16} /> ออกจากระบบ
        </Button>
      </div>

      {/* 🔍 ภาพรวม */}
      <Card className="rounded-2xl shadow border border-purple-200 bg-white/90">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-purple-600">📌 ภาพรวมแพลนของฉัน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 font-bold text-sm text-gray-500 pb-2 border-b">
            <div>ชื่อ</div>
            <div>จำนวนงาน</div>
            <div>ความคืบหน้า</div>
            <div className="text-end">การดำเนินการ</div>
          </div>

          {mySummary.map((u, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-4 items-center text-sm py-4 border-b last:border-0"
            >
              <div className="font-medium text-gray-800">{u.name}</div>
              <div>{u.job} งาน</div>
              <div className="w-full max-w-xs">
                <Progress value={u.progress} />
              </div>
              <div className="flex justify-end mt-3.5">
                <Button variant="default" size="sm" onClick={handleViewMyPlans}>
                  🔍 ดูแพลน
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 📅 ปฏิทิน */}
      <Card className="rounded-2xl bg-white/90 shadow-md border border-purple-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-500">
            <CalendarDays size={20} /> แพลนงานของฉัน
          </h2>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height={500}
            datesSet={(arg) => {
              // ดึงเดือนที่ปฏิทินกำลังแสดงจริง ๆ (ไม่ใช่วันเริ่มสัปดาห์)
              const viewStartDate = new Date(arg.view.currentStart); // ✅ ใช้ currentStart แทน
              const middleOfMonth = new Date(
                viewStartDate.getFullYear(),
                viewStartDate.getMonth(),
                15
              ); // กลางเดือนเพื่อกันเพี้ยน
              setCurrentMonth(middleOfMonth);
            }}
          />
        </CardContent>
      </Card>

      {/* 🪟 Modal */}
      {showPlans && (
        <PlanModal
          userName={user?.name || user?.id_name}
          plans={selectedPlans}
          onClose={() => setShowPlans(false)}
        />
      )}
    </div>
  );
}
