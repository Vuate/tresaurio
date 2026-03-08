import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getDecryptedApiKeyById,
  updateApiKeyPermissions,
} from "@/lib/services/apiKeyService";
import { detectApiKeyPermissions } from "@/lib/services/exchangeService";

// POST /api/exchange/keys/permissions - Refresh permissions for a key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    if (!body.keyId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: keyId" },
        { status: 400 },
      );
    }

    const decrypted = await getDecryptedApiKeyById(body.keyId);
    if (!decrypted) {
      return NextResponse.json(
        { success: false, error: "API key not found or inactive" },
        { status: 404 },
      );
    }

    if (decrypted.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const detected = await detectApiKeyPermissions(decrypted.exchange, {
      apiKey: decrypted.apiKey,
      apiSecret: decrypted.apiSecret,
      passphrase: decrypted.passphrase,
    });

    if (detected.permissions.length > 0) {
      const updated = await updateApiKeyPermissions(
        body.keyId,
        detected.permissions,
      );
      return NextResponse.json({
        success: true,
        data: updated,
        partial: detected.partial,
        warnings: detected.warnings,
      });
    }

    return NextResponse.json({
      success: true,
      data: null,
      partial: true,
      warnings: detected.warnings,
    });
  } catch (error) {
    console.error("[API Keys] Permissions refresh error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to detect permissions" },
      { status: 500 },
    );
  }
}
