// app/api/plan/add/route.js
import { NextResponse } from "next/server";
import Plan from "../../../../../models/Plan";
import User from "../../../../../models/User";
import { connectDB } from "../../../../../lib/mongodb";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const user = await User.findOne({ id_name: body.userid_name });

    if (!user) {
      return NextResponse.json({ success: false, error: "ไม่พบผู้ใช้ในระบบ" }, { status: 404 });
    }

    // 📅 สร้างรหัส Id_title แบบไม่ซ้ำ พร้อม retry
    const today = new Date();
    const datePart = today.toISOString().slice(2, 10).replace(/-/g, ""); // เช่น "250618"
    const prefix = `PLN${datePart}`;
    let retries = 3;
    let newPlan;

    while (retries > 0) {
      try {
        // 🔍 หา Id_title ล่าสุดของวัน
        const latestPlan = await Plan.findOne({
          Id_title: { $regex: `^${prefix}` },
        }).sort({ Id_title: -1 }).lean();

        let runningNumber = "001";
        if (latestPlan) {
          const lastNumber = parseInt(latestPlan.Id_title.slice(-3));
          runningNumber = String(lastNumber + 1).padStart(3, "0");
        }

        const Id_title = `${prefix}${runningNumber}`;

        newPlan = await Plan.create({
          Id_title,
          title: body.title,
          date: body.date,
          id_name: user.id_name,
        });

        break; // สำเร็จ ออกจาก loop
      } catch (err) {
        if (err.code === 11000) {
          retries--; // ถ้ารหัสซ้ำ ลองใหม่
        } else {
          throw err; // ถ้าเป็น error อื่น ส่งออกไป catch ด้านล่าง
        }
      }
    }

    if (!newPlan) {
      return NextResponse.json({ success: false, error: "สร้างรหัสไม่สำเร็จหลังลองซ้ำหลายครั้ง" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: newPlan });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
