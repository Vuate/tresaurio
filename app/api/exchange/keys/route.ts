// app/api/exchange/keys/route.ts
// API Key management endpoints

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  saveApiKey,
  getApiKeys,
  deleteApiKey,
  updateApiKeyLabel,
  updateApiKeyPermissions,
  testApiKey,
  ApiKeyInput,
} from "@/lib/services/apiKeyService";
import { detectApiKeyPermissions } from "@/lib/services/exchangeService";

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
    if (!body.exchange || !body.apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: exchange, apiKey" },
        { status: 400 }
      );
    }
    if (body.exchange !== "hyperliquid" && !body.apiSecret) {
      return NextResponse.json(
        { success: false, error: "API Secret is required for this exchange" },
        { status: 400 }
      );
    }

    // Validate exchange
    const validExchanges = ["binance", "binance-tr", "okx", "bybit", "coinbase", "hyperliquid"];
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

    // Run test and permission detection in parallel to avoid extra latency
    const [testResult, permResult] = await Promise.allSettled([
      testApiKey(session.user.id, input.exchange, apiKey.label || undefined),
      detectApiKeyPermissions(input.exchange, {
        apiKey: body.apiKey,
        apiSecret: body.apiSecret,
        passphrase: body.passphrase,
      }),
    ]);

    const isValid =
      testResult.status === "fulfilled" ? testResult.value : false;
    const detected =
      permResult.status === "fulfilled" ? permResult.value : null;

    let finalData = apiKey;
    let permissionWarnings: string[] = [];

    if (detected && detected.permissions.length > 0) {
      try {
        finalData = await updateApiKeyPermissions(
          apiKey.id,
          detected.permissions,
        );
        permissionWarnings = detected.warnings;
      } catch (err) {
        console.warn("[API Keys] Failed to update detected permissions:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: finalData,
      tested: isValid,
      permissionsDetected: detected ? !detected.partial : false,
      permissionWarnings,
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

// PATCH /api/exchange/keys - Update API key label
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.id || !body.label) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, label" },
        { status: 400 }
      );
    }

    const updated = await updateApiKeyLabel(body.id, body.label);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("[API Keys] PATCH Error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "A key with this label already exists for this exchange" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update API key" },
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
