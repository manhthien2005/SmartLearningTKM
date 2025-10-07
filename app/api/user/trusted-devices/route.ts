import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth/session";

const prisma = new PrismaClient();

/**
 * GET /api/user/trusted-devices
 * Lấy danh sách các thiết bị đã tin cậy của user
 */
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const devices = await prisma.trusted_Devices.findMany({
      where: {
        user_id: parseInt(session.user_id),
        expires_at: {
          gte: new Date(), // Chỉ lấy device chưa hết hạn
        },
      },
      orderBy: {
        last_used: 'desc',
      },
      select: {
        device_id: true,
        device_name: true,
        device_type: true,
        ip_address: true,
        last_used: true,
        expires_at: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      message: "Success",
      devices,
      count: devices.length,
    });
  } catch (error: any) {
    console.error("❌ Error fetching trusted devices:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/trusted-devices
 * Xóa tất cả thiết bị đã tin cậy của user
 */
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { deviceId } = await req.json();

    if (deviceId) {
      // Xóa một thiết bị cụ thể
      await prisma.trusted_Devices.delete({
        where: {
          device_id: deviceId,
          user_id: parseInt(session.user_id), // Đảm bảo chỉ xóa device của mình
        },
      });

      return NextResponse.json({
        message: "Thiết bị đã được xóa thành công",
      });
    } else {
      // Xóa tất cả thiết bị của user
      const result = await prisma.trusted_Devices.deleteMany({
        where: {
          user_id: parseInt(session.user_id),
        },
      });

      return NextResponse.json({
        message: `Đã xóa ${result.count} thiết bị`,
        count: result.count,
      });
    }
  } catch (error: any) {
    console.error("❌ Error deleting trusted devices:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
