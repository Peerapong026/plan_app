import { connectDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB();//เชื่อมต่อฐานข้อมูล
        const user = await User.find({});//ดึงข้อมูลจาก collection
        console.log("Fetched user:", user); // ตรวจสอบข้อมูลที่ดึงมาจาก MongoDB
        return NextResponse.json(user);// ส่งข้อมูล JSON กลับ
    }catch (error){
        console.error("Error fetching user:", error); // ข้อผิดพลาดในการดึงข้อมูล
        return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
    }
}
