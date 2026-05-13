import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isValidTemplateName } from "@/lib/sanitize";

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

    if (!isValidTemplateName(String(name))) {
      return NextResponse.json(
        { error: "Invalid template name: only letters, numbers, spaces, and basic punctuation are allowed (max 100 chars)" },
        { status: 400 }
      );
    }

    // Case-insensitive: find existing template
    const existing = await prisma.dashboardTemplate.findFirst({
      where: {
        userId: session.user.id,
        name: { equals: name, mode: "insensitive" },
      },
    });

    let template;
    if (existing) {
      template = await prisma.dashboardTemplate.update({
        where: { id: existing.id },
        data: { name, layout },
      });
    } else {
      template = await prisma.dashboardTemplate.create({
        data: {
          userId: session.user.id,
          name,
          layout,
        },
      });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Templates POST error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
