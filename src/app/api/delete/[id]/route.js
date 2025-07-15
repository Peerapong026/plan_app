// 📁 /app/api/delete/[id]/route.js
import { connectDB } from "../../../../../lib/mongodb";
import Plan from "../../../../../models/Plan";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
  const { id } = await context.params;

  try {
    await connectDB();

    const deleted = await Plan.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "ไม่พบแผน" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE plan error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
