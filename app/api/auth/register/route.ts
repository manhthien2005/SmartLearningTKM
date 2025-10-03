import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try{
    const body = await req.json();

    const {
      email,
      password,
      full_name,
      phone_number,
      date_of_birth,
      gender,
      address
    } = body;

    if(!email || !password || !full_name){
      return NextResponse.json({error: "Vui lòng nhập đầy đủ email, password và full_name"}, {status: 400});
    }

    const existingUser = await prisma.users.findUnique({where: {email}});

    if(existingUser){
      return NextResponse.json({error: "Email đã được sử dụng!"}, {status: 400});
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        email,
        password_hash,
        full_name,
        phone_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender,
        address
      }
    });

    const studentRole = await prisma.roles.findUnique({where: {role_name: "student"}});

    if(studentRole){
      await prisma.user_roles.create({
        data: {
          user_id: newUser.user_id,
          role_id: studentRole.role_id
        }
      });
    }

    return NextResponse.json(
      { mesage: "Đăng ký thành công", user: newUser },
      { status: 201 }
    );
  }catch(error){
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({error: "Lỗi máy chủ"}, {status: 500});
  }
}