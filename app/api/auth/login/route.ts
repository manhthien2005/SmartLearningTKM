import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { m } from "framer-motion";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
    try{
        const{email, password} = await req.json();

        if(!email || !password){
            return NextResponse.json({error: "Vui lòng nhập đầy đủ email và password"}, {status: 400});
        }

        // Tìm user theo email
        const user = await prisma.users.findUnique({where: {email}});

        if(!user){
            return NextResponse.json({error: "Sai email hoặc mật khẩu!"}, {status: 401});
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return NextResponse.json({error: "Sai email hoặc mật khẩu!"}, {status: 401});
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name
            },
            JWT_SECRET,
            {expiresIn: "1h"}
        );

        // Trả về user + token
        return NextResponse.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name
            },
        });
    }catch(error){
        console.error("Lỗi đăng nhập:", error);
        return NextResponse.json({error: "Lỗi máy chủ"}, {status: 500});
    }
}