import { connectDB } from "../../../../../lib/mongodb";
import Plan from "../../../../../models/Plan";

export async function POST(req) {
  try {
    await connectDB(); // ถ้าใช้ระบบแยก DB
    const body = await req.json();
    const { _id, title, date } = body;

    if (!_id) {
      return new Response(JSON.stringify({ success: false, message: "Missing plan ID" }), { status: 400 });
    }

    await Plan.findByIdAndUpdate(_id, { title, date });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return new Response(JSON.stringify({ success: false, message: "Update failed" }), { status: 500 });
  }
}