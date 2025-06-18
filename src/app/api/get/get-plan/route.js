import { connectDB } from '../../../../../lib/mongodb';
import Plan from '../../../../../models/Plan';
import User from '../../../../../models/User';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const plans = await Plan.find({});
    const users = await User.find({}, "id_name name");

    const nameMap = {};
    users.forEach(user => {
      nameMap[user.id_name] = user.name;
    });

    const enrichedPlans = plans.map(plan => ({
      ...plan.toObject(),
      userName: nameMap[plan.id_name] || "ไม่ระบุ"
    }));

    return NextResponse.json({ success: true, data: enrichedPlans });

  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json({ message: "Error fetching plan", error }, { status: 500 });
  }
}
