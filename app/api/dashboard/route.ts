// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Kullanıcının dashboard layout'unu getir
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dashboard = await prisma.userDashboard.findUnique({
      where: { userId: session.user.id },
    });

    if (!dashboard) {
      // Kullanıcının henüz kaydedilmiş layout'u yok
      return NextResponse.json({ layout: null });
    }

    return NextResponse.json({ layout: dashboard.layout });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Kullanıcının dashboard layout'unu kaydet
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { layout } = body;

    if (!layout) {
      return NextResponse.json(
        { error: "Layout gerekli" },
        { status: 400 }
      );
    }

    // Upsert - varsa güncelle, yoksa oluştur
    const dashboard = await prisma.userDashboard.upsert({
      where: { userId: session.user.id },
      update: { layout },
      create: {
        userId: session.user.id,
        layout,
      },
    });

    return NextResponse.json({
      message: "Dashboard kaydedildi",
      layout: dashboard.layout,
    });
  } catch (error) {
    console.error("Dashboard POST error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
