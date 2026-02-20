import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = request.headers.get("x-admin-password");

  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUsers, users, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { action: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userActivityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: { totalUsers, users, recentLogs },
  });
}
