import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET — Fetch all user templates
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.dashboardTemplate.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Templates GET error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// POST — Save new template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, layout } = await request.json();

    if (!name || !layout) {
      return NextResponse.json(
        { error: "name and layout are required" },
        { status: 400 }
      );
    }

    const template = await prisma.dashboardTemplate.upsert({
      where: {
        userId_name: { userId: session.user.id, name },
      },
      update: { layout },
      create: {
        userId: session.user.id,
        name,
        layout,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Templates POST error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
