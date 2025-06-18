import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { id_name, password } = await req.json();

    if (!id_name || !password) {
      return Response.json({ error: "กรุณาระบุอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    const user = await User.findOne({ id_name });
    if (!user) {
      return Response.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    if (user.password !== password) {
      return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    return Response.json({
      id_name: user.id_name,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
  }
}
