"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";

export interface ExchangeConnection {
  id: string;
  exchange: string;
  label: string | null;
  permissions: string[];
  isTestnet: boolean;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface RefreshPermissionsResult {
  success: boolean;
  permissions?: string[];
  partial?: boolean;
  warnings?: string[];
}

interface UseExchangeKeysReturn {
  keys: ExchangeConnection[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteKey: (id: string) => Promise<boolean>;
  updateLabel: (id: string, label: string) => Promise<boolean>;
  refreshPermissions: (id: string) => Promise<RefreshPermissionsResult>;
  hasKeyForExchange: (exchange: string) => boolean;
  getKeysForExchange: (exchange: string) => ExchangeConnection[];
}

export function useExchangeKeys(): UseExchangeKeysReturn {
  const [keys, setKeys] = useState<ExchangeConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/exchange/keys");
      const data = await response.json();
      if (data.success) {
        setKeys(data.data);
      } else {
        setError(data.error || "Failed to fetch keys");
      }
    } catch {
      setError("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteKey = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await apiFetch(`/api/exchange/keys?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const updateLabel = useCallback(async (id: string, label: string): Promise<boolean> => {
    try {
      const response = await apiFetch("/api/exchange/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label }),
      });
      const data = await response.json();
      if (data.success) {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, label } : k))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const refreshPermissions = useCallback(
    async (id: string): Promise<RefreshPermissionsResult> => {
      try {
        const response = await apiFetch("/api/exchange/keys/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyId: id }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          setKeys((prev) =>
            prev.map((k) =>
              k.id === id ? { ...k, permissions: data.data.permissions } : k,
            ),
          );
          return {
            success: true,
            permissions: data.data.permissions,
            partial: data.partial,
            warnings: data.warnings,
          };
        }
        return {
          success: false,
          partial: data.partial,
          warnings: data.warnings || ["Detection returned no results"],
        };
      } catch {
        return { success: false, warnings: ["Failed to refresh permissions"] };
      }
    },
    [],
  );

  const hasKeyForExchange = useCallback(
    (exchange: string) => keys.some((k) => k.exchange === exchange && k.isActive),
    [keys]
  );

  const getKeysForExchange = useCallback(
    (exchange: string) => keys.filter((k) => k.exchange === exchange && k.isActive),
    [keys]
  );

  return {
    keys,
    loading,
    error,
    refetch,
    deleteKey,
    updateLabel,
    refreshPermissions,
    hasKeyForExchange,
    getKeysForExchange,
  };
}
