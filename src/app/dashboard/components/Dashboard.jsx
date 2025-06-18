"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Progress } from "../../components/ui/Progess";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CardContent } from "../../components/ui/CardContent";
import { LogOut, CalendarDays } from "lucide-react";
import PlanModal from "../components/Planmodal";

const pastelColors = [
  "#A5D8FF", "#FFC9DE", "#C5F6FA", "#E0BBE4", "#FFDEB4",
  "#B5EAD7", "#FFD6A5", "#D0F4DE", "#C2C2F0", "#F4BFBF",
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pastelColors.length;
  return pastelColors[index];
};

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [planList, setPlanList] = useState([]); // ✅ เก็บ raw plan เต็ม
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [summary, setSummary] = useState([]);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const calendarRef = useRef(null);
  const [selectedUserPlans, setSelectedUserPlans] = useState([]);
  const [showUserPlans, setShowUserPlans] = useState(null);

  const fetchPlans = async (month, year) => {
    try {
      const res = await fetch("/api/get/get-plan/");
      const result = await res.json();
      if (result.success) {
        setPlanList(result.data); // ✅ เก็บ plan ทั้งหมด

        const filtered = result.data.filter((plan) => {
          const d = new Date(plan.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });

        setEvents(
          filtered.map((plan) => {
            const name = plan.userName || "ไม่ระบุ";
            const color = getColorFromName(name);
            return {
              title: `${name}: ${plan.title}`,
              start: new Date(plan.date).toISOString().split("T")[0],
              backgroundColor: color,
              borderColor: color,
              textColor: "#333",
            };
          })
        );

        const summary = filtered.reduce((acc, plan) => {
          const name = plan.userName || "ไม่ระบุ";
          acc[name] = acc[name] || { job: 0 };
          acc[name].job++;
          return acc;
        }, {});

        setSummary(
          Object.entries(summary).map(([name, v]) => ({
            name,
            job: v.job,
            progress: Math.min(v.job * 5, 100),
          }))
        );
      }
    } catch (err) {
      console.error("โหลดแผนงานล้มเหลว", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPlans(selectedMonth, selectedYear);
    }
  }, [user]);

  const handleViewPlans = (userName) => {
    const plans = planList
      .filter((p) => p.userName === userName)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // ✅ ใหม่ → เก่า
    setSelectedUserPlans(plans);
    setShowUserPlans(userName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 p-4 space-y-6 w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          📊 ระบบแพลนงานทีม
        </h1>
        <Button
          variant="danger"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </Button>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-500">
            👥 ภาพรวมแพลนงานทีม
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 font-bold border-b pb-3 text-sm text-gray-500">
            <div>ชื่อ</div>
            <div>จำนวนงาน</div>
            <div>ความคืบหน้า</div>
            <div>การดำเนินการ</div>
          </div>

          {summary.map((u, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-4 py-4 items-center text-sm border-b last:border-0"
            >
              <div className="font-medium text-gray-800">{u.name}</div>
              <div>{u.job} งาน</div>
              <div className="w-full max-w-xs">
                <Progress value={u.progress} />
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="default" size="sm" onClick={() => handleViewPlans(u.name)}>
                  🔍 ดูแพลน
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarDays size={20} />
            ปฏิทินแพลนงาน
          </h2>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height={500}
            datesSet={() => {
              const calendarApi = calendarRef.current?.getApi();
              if (!calendarApi) return;
              const currentDate = calendarApi.getDate();
              const month = currentDate.getMonth();
              const year = currentDate.getFullYear();
              setSelectedMonth(month);
              setSelectedYear(year);
              fetchPlans(month, year);
            }}
          />
        </CardContent>
      </Card>

      <PlanModal
        userName={showUserPlans}
        plans={selectedUserPlans}
        onClose={() => setShowUserPlans(null)}
      />
    </div>
  );
}
