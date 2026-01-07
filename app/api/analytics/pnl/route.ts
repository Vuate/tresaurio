import { NextResponse } from "next/server";
import type {
  PnLRequest,
  PnLResponse,
} from "@/lib/personalized-dashboard/types";

export async function POST(req: Request) {
  try {
    const payload: PnLRequest = await req.json();

    const res = await fetch("http://localhost:8000/calc/pnl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const data: PnLResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Analytics service unavailable" },
      { status: 500 }
    );
  }
}
