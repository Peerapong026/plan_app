// 📁 /app/api/update/[id]/route.js
import { connectDB } from "../../../../../lib/mongodb";
import Plan from "../../../../../models/Plan";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    await connectDB();

    const updated = await Plan.findByIdAndUpdate(
      id,
      {
        title: body.title,
        date: body.date,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "ไม่พบแผนเพื่อแก้ไข" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE plan error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
