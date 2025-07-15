// 📁 /app/api/get/[id]/route.js
import { connectDB } from "../../../../../lib/mongodb";
import Plan from "../../../../../models/Plan";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    await connectDB();
    const plan = await Plan.findById(id);

    if (!plan) {
      return NextResponse.json({ success: false, message: "ไม่พบแผนนี้" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

