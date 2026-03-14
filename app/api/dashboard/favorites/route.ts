import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.userFavorite.findMany({
      where: { userId: session.user.id },
      orderBy: { favoritedAt: "desc" },
    });

    return NextResponse.json({
      favorites: favorites.map((f) => ({
        type: f.type,
        favoritedAt: f.favoritedAt.getTime(),
      })),
    });
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { favorites } = await request.json();

    await prisma.userFavorite.deleteMany({
      where: { userId: session.user.id },
    });

    if (favorites.length > 0) {
      await prisma.userFavorite.createMany({
        data: favorites.map((f: { type: string; favoritedAt: number }) => ({
          userId: session.user.id,
          type: f.type,
          favoritedAt: new Date(f.favoritedAt),
        })),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Favorites POST error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
