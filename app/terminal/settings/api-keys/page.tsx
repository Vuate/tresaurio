"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useExchangeKeys, ExchangeConnection } from "@/hooks/useExchangeKeys";
import {
  Key,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  AlertTriangle,
  ArrowLeft,
  Shield,
  RefreshCw,
  ShieldAlert,
  Eye,
  TrendingUp,
  ArrowUpDown,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";

const SUPPORTED_EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "binance-tr", name: "Binance TR" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
  { id: "coinbase", name: "Coinbase" },
  { id: "hyperliquid", name: "Hyperliquid" },
];

const PERMISSION_CONFIG: Record<
  string,
  { label: string; icon: typeof Eye; color: string; bgColor: string; borderColor: string; level: "safe" | "elevated" | "danger" }
> = {
  read: { label: "Read", icon: Eye, color: "text-[#2563EB]", bgColor: "bg-[#2563EB]/15", borderColor: "border-[#2563EB]/25", level: "safe" },
  spot: { label: "Spot", icon: TrendingUp, color: "text-emerald-400", bgColor: "bg-emerald-500/15", borderColor: "border-emerald-500/25", level: "safe" },
  futures: { label: "Futures", icon: ArrowUpDown, color: "text-purple-400", bgColor: "bg-purple-500/15", borderColor: "border-purple-500/25", level: "safe" },
  margin: { label: "Margin", icon: ArrowRightLeft, color: "text-yellow-400", bgColor: "bg-yellow-500/15", borderColor: "border-yellow-500/25", level: "elevated" },
  withdraw: { label: "Withdraw", icon: Wallet, color: "text-red-400", bgColor: "bg-red-500/15", borderColor: "border-red-500/25", level: "danger" },
  internal_transfer: { label: "Transfer", icon: ArrowRightLeft, color: "text-orange-400", bgColor: "bg-orange-500/15", borderColor: "border-orange-500/25", level: "elevated" },
};

function PermissionBadge({ permission }: { permission: string }) {
  const config = PERMISSION_CONFIG[permission];
  if (!config) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-input border border-border text-foreground/50">
        {permission}
      </span>
    );
  }
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${config.bgColor} ${config.borderColor} ${config.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatLastUsed(lastUsedAt: string | null): string {
  if (!lastUsedAt) return "Never";
  const d = new Date(lastUsedAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function ApiKeysSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { keys, loading, refetch, deleteKey, updateLabel, refreshPermissions } = useExchangeKeys();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [refreshingPerms, setRefreshingPerms] = useState<string | null>(null);
  const [permWarnings, setPermWarnings] = useState<Record<string, string[]>>({});

  const [exchangeDropdownOpen, setExchangeDropdownOpen] = useState(false);
  const exchangeDropdownRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ exchange: "binance", apiKey: "", apiSecret: "", passphrase: "", label: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!exchangeDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (exchangeDropdownRef.current && !exchangeDropdownRef.current.contains(e.target as Node)) {
        setExchangeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exchangeDropdownOpen]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground/40 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-44px)] md:min-h-[calc(100vh-64px)] bg-background gap-4">
        <div className="w-16 h-16 rounded-full bg-input border border-border-sub flex items-center justify-center">
          <Shield className="w-6 h-6 text-foreground/20" />
        </div>
        <div className="text-foreground/60 text-sm">Please sign in to manage API keys.</div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.apiKey) { setSaveError("API Key / Wallet Address is required"); return; }
    if (form.exchange !== "hyperliquid" && !form.apiSecret) { setSaveError("API Secret is required"); return; }
    if ((form.exchange === "okx" || form.exchange === "coinbase") && !form.passphrase) { setSaveError("Passphrase is required for this exchange"); return; }

    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch("/api/exchange/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchange: form.exchange, apiKey: form.apiKey, apiSecret: form.apiSecret || "none", passphrase: form.passphrase || undefined, label: form.label || undefined, permissions: ["spot", "futures"] }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to save API key");
      await refetch();
      if (data.permissionWarnings?.length > 0 && data.data?.id) {
        setPermWarnings((prev) => ({ ...prev, [data.data.id]: data.permissionWarnings }));
      }
      setShowAddForm(false);
      setForm({ exchange: "binance", apiKey: "", apiSecret: "", passphrase: "", label: "" });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: ExchangeConnection) => {
    if (!confirm(`Delete API key "${key.label || key.exchange}"? This cannot be undone.`)) return;
    setDeletingId(key.id);
    await deleteKey(key.id);
    setDeletingId(null);
  };

  const handleEditLabel = (key: ExchangeConnection) => { setEditingId(key.id); setEditLabel(key.label || ""); };
  const handleSaveLabel = async (id: string) => {
    if (editLabel.trim()) await updateLabel(id, editLabel.trim());
    setEditingId(null);
    setEditLabel("");
  };

  const handleTestKey = async (key: ExchangeConnection) => {
    setTesting(key.id);
    setTestResults((prev) => ({ ...prev, [key.id]: null }));
    try {
      const response = await fetch(`/api/exchange/account?exchange=${key.exchange}`);
      const data = await response.json();
      setTestResults((prev) => ({ ...prev, [key.id]: data.success }));
    } catch {
      setTestResults((prev) => ({ ...prev, [key.id]: false }));
    } finally {
      setTesting(null);
    }
  };

  const handleRefreshPermissions = async (key: ExchangeConnection) => {
    setRefreshingPerms(key.id);
    const result = await refreshPermissions(key.id);
    if (result.warnings && result.warnings.length > 0) {
      setPermWarnings((prev) => ({ ...prev, [key.id]: result.warnings! }));
    } else {
      setPermWarnings((prev) => { const next = { ...prev }; delete next[key.id]; return next; });
    }
    setRefreshingPerms(null);
  };

  const needsPassphrase = form.exchange === "okx" || form.exchange === "coinbase";
  const selectedExchangeName = SUPPORTED_EXCHANGES.find((e) => e.id === form.exchange)?.name || form.exchange;

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen bg-background -mt-4 sm:-mt-6 md:mt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 md:pt-10">

          {/* Back nav */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[#71717A] hover:text-foreground text-xs mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Page header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#2563EB]" />
                </div>
                API Keys
              </h1>
              <p className="text-[#71717A] text-sm mt-2">
                Manage your exchange API connections. Keys are encrypted at rest using AES-256-GCM.
              </p>
            </div>

            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1a7ee8] text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Key
              </button>
            )}
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-3 p-3.5 mb-6 bg-yellow-500/8 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-yellow-400/80 text-xs leading-relaxed">
              <strong>Security Tip:</strong> Only use READ-ONLY API keys. Never grant withdrawal permissions.
              Your keys are encrypted and never exposed in the browser after saving.
            </div>
          </div>

          {/* Add key form */}
          {showAddForm && (
            <div className="mb-6 p-5 bg-card border border-border-sub rounded-xl">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-sub">
                <h3 className="text-[0.95rem] font-bold text-foreground flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
                  Add New API Key
                </h3>
                <button
                  onClick={() => { setShowAddForm(false); setSaveError(null); }}
                  className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Exchange selector */}
                <div>
                  <label className="block text-[#71717A] mb-1.5 text-xs font-medium">Exchange</label>
                  <div ref={exchangeDropdownRef} className="relative">
                    <button
                      onClick={() => setExchangeDropdownOpen((v) => !v)}
                      className="w-full h-9 flex items-center justify-between bg-card-alt border border-border rounded-lg px-3 text-foreground text-xs cursor-pointer hover:border-[#2563EB]/40 transition-colors"
                    >
                      <span>{selectedExchangeName}</span>
                      <span className={`text-foreground/50 transition-transform ${exchangeDropdownOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    {exchangeDropdownOpen && (
                      <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                        {SUPPORTED_EXCHANGES.map((ex, i) => (
                          <button
                            key={ex.id}
                            onClick={() => { setForm({ ...form, exchange: ex.id }); setExchangeDropdownOpen(false); }}
                            className={[
                              "w-full px-4 py-2.5 text-left text-xs cursor-pointer transition-colors duration-150 flex items-center justify-between",
                              i < SUPPORTED_EXCHANGES.length - 1 ? "border-b border-border-sub" : "",
                              form.exchange === ex.id
                                ? "bg-[#2563EB]/10 text-[#2563EB]"
                                : "text-[#71717A] hover:bg-foreground/4 hover:text-foreground",
                            ].join(" ")}
                          >
                            <span>{ex.name}</span>
                            {form.exchange === ex.id && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-[#71717A] mb-1.5 text-xs font-medium">Label</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="e.g., Main Trading Account"
                    className="w-full bg-card-alt border border-border rounded-lg px-3 py-2.5 text-foreground text-xs outline-none focus:border-[#2563EB]/50 transition-colors placeholder:text-[#71717A]/60"
                  />
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-[#71717A] mb-1.5 text-xs font-medium">API Key</label>
                  <input
                    type="password"
                    value={form.apiKey}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full bg-card-alt border border-border rounded-lg px-3 py-2.5 text-foreground text-xs outline-none focus:border-[#2563EB]/50 transition-colors placeholder:text-[#71717A]/60"
                  />
                </div>

                {/* API Secret */}
                {form.exchange !== "hyperliquid" && (
                  <div>
                    <label className="block text-[#71717A] mb-1.5 text-xs font-medium">API Secret</label>
                    <input
                      type="password"
                      value={form.apiSecret}
                      onChange={(e) => setForm({ ...form, apiSecret: e.target.value })}
                      placeholder="Enter your API secret"
                      className="w-full bg-card-alt border border-border rounded-lg px-3 py-2.5 text-foreground text-xs outline-none focus:border-[#2563EB]/50 transition-colors placeholder:text-[#71717A]/60"
                    />
                  </div>
                )}

                {/* Passphrase */}
                {needsPassphrase && (
                  <div>
                    <label className="block text-[#71717A] mb-1.5 text-xs font-medium">Passphrase</label>
                    <input
                      type="password"
                      value={form.passphrase}
                      onChange={(e) => setForm({ ...form, passphrase: e.target.value })}
                      placeholder="Enter your passphrase"
                      className="w-full bg-card-alt border border-border rounded-lg px-3 py-2.5 text-foreground text-xs outline-none focus:border-[#2563EB]/50 transition-colors placeholder:text-[#71717A]/60"
                    />
                  </div>
                )}

                {saveError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                    {saveError}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-[#2563EB] hover:bg-[#1a7ee8] disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                >
                  <Key className="w-4 h-4" />
                  {saving ? "Connecting..." : "Connect & Save"}
                </button>
              </div>
            </div>
          )}

          {/* Keys list */}
          {loading ? (
            <div className="text-center py-12 text-[#71717A] text-sm">Loading your API keys...</div>
          ) : keys.length === 0 && !showAddForm ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center">
                <Key className="w-6 h-6 text-[#2563EB]/50" />
              </div>
              <div className="text-foreground text-sm font-medium mb-2">No API Keys Yet</div>
              <div className="text-[#71717A] text-xs mb-6 max-w-sm mx-auto">
                Add your first exchange API key to start syncing positions, balances, and orders across all tools.
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1a7ee8] text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Your First Key
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => {
                const isEditing = editingId === key.id;
                const isDeleting = deletingId === key.id;
                const isTesting = testing === key.id;
                const testResult = testResults[key.id];

                return (
                  <div
                    key={key.id}
                    className={`p-4 rounded-xl border transition-all ${isDeleting ? "opacity-50" : ""} ${key.isActive ? "bg-card border-border-sub hover:border-border" : "bg-surface border-border-sub opacity-60"}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/20 rounded text-[10px] uppercase font-bold shrink-0">
                            {key.exchange}
                          </span>

                          {isEditing ? (
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <input
                                type="text"
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => { if (e.key === "Enter") handleSaveLabel(key.id); if (e.key === "Escape") setEditingId(null); }}
                                className="flex-1 bg-input border border-[#2563EB]/50 rounded px-2 py-0.5 text-foreground text-xs outline-none min-w-0"
                              />
                              <button onClick={() => handleSaveLabel(key.id)} className="text-[#2563EB] hover:text-[#2563EB]/80 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingId(null)} className="text-foreground/40 hover:text-foreground cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <span className="text-foreground font-medium text-sm truncate">{key.label || `${key.exchange}-default`}</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {key.permissions.map((perm) => (<PermissionBadge key={perm} permission={perm} />))}
                          {key.permissions.includes("withdraw") && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 border border-red-500/20 text-red-400">
                              <ShieldAlert className="w-2.5 h-2.5" />Warning
                            </span>
                          )}
                        </div>

                        {key.permissions.includes("withdraw") && (
                          <div className="flex items-start gap-1.5 mb-2 p-2 bg-red-500/5 border border-red-500/15 rounded-lg text-[10px] text-red-400/80">
                            <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>Withdrawal permission detected. Consider using a read-only key for better security.</span>
                          </div>
                        )}

                        {permWarnings[key.id] && permWarnings[key.id].length > 0 && (
                          <div className="flex items-start gap-1.5 mb-2 p-2 bg-yellow-500/5 border border-yellow-500/15 rounded-lg text-[10px] text-yellow-400/80">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{permWarnings[key.id].join(" ")}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                          <span className={`flex items-center gap-1.5 ${key.isActive ? "text-emerald-400" : "text-red-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${key.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                            {key.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-[#71717A]">Added {formatDate(key.createdAt)}</span>
                          <span className="text-[#71717A]">Last used: {formatLastUsed(key.lastUsedAt)}</span>
                          {testResult !== undefined && testResult !== null && (
                            <span className={testResult ? "text-emerald-400" : "text-red-400"}>
                              {testResult ? "Test passed" : "Test failed"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRefreshPermissions(key)}
                          disabled={refreshingPerms === key.id}
                          className="h-7 px-2 bg-input border border-border-sub text-foreground/50 rounded-lg text-[10px] hover:bg-foreground/8 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          title="Detect Permissions"
                        >
                          <Shield className={`w-3 h-3 ${refreshingPerms === key.id ? "animate-pulse" : ""}`} />
                          <span className="hidden sm:inline">Permissions</span>
                        </button>
                        <button
                          onClick={() => handleTestKey(key)}
                          disabled={isTesting}
                          className="h-7 px-2 bg-input border border-border-sub text-foreground/50 rounded-lg text-[10px] hover:bg-foreground/8 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          title="Test Connection"
                        >
                          <RefreshCw className={`w-3 h-3 ${isTesting ? "animate-spin" : ""}`} />
                          <span className="hidden sm:inline">Test</span>
                        </button>
                        {!isEditing && (
                          <button
                            onClick={() => handleEditLabel(key)}
                            className="h-7 px-2 bg-input border border-border-sub text-foreground/50 rounded-lg text-[10px] hover:bg-foreground/8 hover:text-foreground transition-colors cursor-pointer"
                            title="Edit Label"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(key)}
                          disabled={isDeleting}
                          className="h-7 px-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[10px] hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Key"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
