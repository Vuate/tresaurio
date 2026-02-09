// lib/services/apiKeyService.ts
// API Key management service with encryption

import prisma from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encryption";

export type Exchange = "binance" | "binance-tr" | "okx" | "bybit" | "coinbase";
export type Permission = "spot" | "futures" | "withdraw";

export interface ApiKeyInput {
  userId: string;
  exchange: Exchange;
  label?: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string; // Required for OKX, Coinbase
  permissions: Permission[];
  isTestnet?: boolean;
}

export interface ApiKeyOutput {
  id: string;
  exchange: Exchange;
  label: string | null;
  permissions: string[];
  isTestnet: boolean;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export interface DecryptedApiKey {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
}

/**
 * Save a new API key (encrypted)
 */
export async function saveApiKey(input: ApiKeyInput): Promise<ApiKeyOutput> {
  const apiKey = await prisma.apiKey.create({
    data: {
      userId: input.userId,
      exchange: input.exchange,
      label: input.label || `${input.exchange}-default`,
      apiKey: encrypt(input.apiKey),
      apiSecret: encrypt(input.apiSecret),
      passphrase: input.passphrase ? encrypt(input.passphrase) : null,
      permissions: input.permissions,
      isTestnet: input.isTestnet || false,
    },
    select: {
      id: true,
      exchange: true,
      label: true,
      permissions: true,
      isTestnet: true,
      isActive: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return apiKey as ApiKeyOutput;
}

/**
 * Get all API keys for a user (without secrets)
 */
export async function getApiKeys(userId: string, exchange?: Exchange): Promise<ApiKeyOutput[]> {
  const where = exchange
    ? { userId, exchange, isActive: true }
    : { userId, isActive: true };

  const keys = await prisma.apiKey.findMany({
    where,
    select: {
      id: true,
      exchange: true,
      label: true,
      permissions: true,
      isTestnet: true,
      isActive: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return keys as ApiKeyOutput[];
}

/**
 * Get decrypted API credentials for use in API calls
 * ONLY use server-side!
 */
export async function getDecryptedApiKey(
  userId: string,
  exchange: Exchange,
  label?: string
): Promise<DecryptedApiKey | null> {
  const where = label
    ? { userId, exchange, label, isActive: true }
    : { userId, exchange, isActive: true };

  const key = await prisma.apiKey.findFirst({
    where,
    select: {
      id: true,
      apiKey: true,
      apiSecret: true,
      passphrase: true,
    },
  });

  if (!key) return null;

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    apiKey: decrypt(key.apiKey),
    apiSecret: decrypt(key.apiSecret),
    passphrase: key.passphrase ? decrypt(key.passphrase) : undefined,
  };
}

/**
 * Delete an API key
 */
export async function deleteApiKey(id: string): Promise<void> {
  await prisma.apiKey.delete({ where: { id } });
}

/**
 * Deactivate an API key (soft delete)
 */
export async function deactivateApiKey(id: string): Promise<void> {
  await prisma.apiKey.update({
    where: { id },
    data: { isActive: false },
  });
}

/**
 * Test API key by making a simple request to the exchange
 */
export async function testApiKey(userId: string, exchange: Exchange, label?: string): Promise<boolean> {
  try {
    const credentials = await getDecryptedApiKey(userId, exchange, label);
    if (!credentials) return false;

    // TODO: Implement actual test calls to each exchange
    // For now, just return true if credentials exist
    return true;
  } catch {
    return false;
  }
}
