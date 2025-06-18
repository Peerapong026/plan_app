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

    // 📅 สร้างรหัส Id_title
    const today = new Date();
    const datePart = today
      .toISOString()
      .slice(2, 10) // "25-06-11"
      .replace(/-/g, ""); // "250611"

    const prefix = `PLN${datePart}`;

    // 🔍 ดึงจำนวนแผนที่มี prefix นี้แล้ว
    const countToday = await Plan.countDocuments({
      Id_title: { $regex: `^${prefix}` },
    });

    const runningNumber = String(countToday + 1).padStart(3, "0"); // เช่น 001
    const Id_title = `${prefix}${runningNumber}`; // เช่น PLN250611001

    const newPlan = await Plan.create({
      Id_title,
      title: body.title,
      date: body.date,
      id_name: user.id_name,
    });

    return NextResponse.json({ success: true, data: newPlan });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
