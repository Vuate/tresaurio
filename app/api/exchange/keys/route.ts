// app/api/exchange/keys/route.ts
// API Key management endpoints

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  saveApiKey,
  getApiKeys,
  deleteApiKey,
  testApiKey,
  ApiKeyInput,
} from "@/lib/services/apiKeyService";

// GET /api/exchange/keys - List all API keys
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get("exchange") as ApiKeyInput["exchange"] | null;

    const keys = await getApiKeys(session.user.id, exchange || undefined);

    return NextResponse.json({
      success: true,
      data: keys,
    });
  } catch (error) {
    console.error("[API Keys] GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/exchange/keys - Add new API key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.exchange || !body.apiKey || !body.apiSecret) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: exchange, apiKey, apiSecret" },
        { status: 400 }
      );
    }

    // Validate exchange
    const validExchanges = ["binance", "binance-tr", "okx", "bybit", "coinbase"];
    if (!validExchanges.includes(body.exchange)) {
      return NextResponse.json(
        { success: false, error: `Invalid exchange. Must be one of: ${validExchanges.join(", ")}` },
        { status: 400 }
      );
    }

    // OKX and Coinbase require passphrase
    if ((body.exchange === "okx" || body.exchange === "coinbase") && !body.passphrase) {
      return NextResponse.json(
        { success: false, error: `${body.exchange} requires a passphrase` },
        { status: 400 }
      );
    }

    const input: ApiKeyInput = {
      userId: session.user.id,
      exchange: body.exchange,
      label: body.label,
      apiKey: body.apiKey,
      apiSecret: body.apiSecret,
      passphrase: body.passphrase,
      permissions: body.permissions || ["spot"],
      isTestnet: body.isTestnet || false,
    };

    const apiKey = await saveApiKey(input);

    // Test the API key
    const isValid = await testApiKey(session.user.id, input.exchange, apiKey.label || undefined);

    return NextResponse.json({
      success: true,
      data: apiKey,
      tested: isValid,
    });
  } catch (error) {
    console.error("[API Keys] POST Error:", error);

    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "An API key with this label already exists for this exchange" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to save API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/exchange/keys - Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    await deleteApiKey(id);

    return NextResponse.json({
      success: true,
      message: "API key deleted successfully",
    });
  } catch (error) {
    console.error("[API Keys] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
