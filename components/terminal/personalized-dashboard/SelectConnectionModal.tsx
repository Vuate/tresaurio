"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Check,
  ExternalLink,
  X,
  AlertTriangle,
  Eye,
  TrendingUp,
  ArrowUpDown,
  ArrowRightLeft,
  Wallet,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ExchangeConnection } from "@/hooks/useExchangeKeys";

const PERM_STYLE: Record<string, { icon: typeof Eye; color: string; bg: string }> = {
  read: { icon: Eye, color: "text-blue-400", bg: "bg-blue-500/15" },
  spot: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  futures: { icon: ArrowUpDown, color: "text-purple-400", bg: "bg-purple-500/15" },
  margin: { icon: ArrowRightLeft, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  withdraw: { icon: Wallet, color: "text-red-400", bg: "bg-red-500/15" },
  internal_transfer: { icon: ArrowRightLeft, color: "text-orange-400", bg: "bg-orange-500/15" },
};

interface Props {
  open: boolean;
  onClose: () => void;
  keys: ExchangeConnection[];
  loading: boolean;
  onSelect: (key: ExchangeConnection) => void;
  selectedKeyId?: string | null;
  exchangeFilter?: string;
  title?: string;
}

function maskKey(label: string | null, exchange: string): string {
  if (label) return label;
  return `${exchange.charAt(0).toUpperCase()}${exchange.slice(1)} Key`;
}

function formatLastUsed(lastUsedAt: string | null): string {
  if (!lastUsedAt) return "Never used";
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

export default function SelectConnectionModal({
  open,
  onClose,
  keys,
  loading,
  onSelect,
  selectedKeyId,
  exchangeFilter,
  title = "Select Exchange Connection",
}: Props) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!open) return null;

  const filteredKeys = exchangeFilter
    ? keys.filter((k) => k.exchange === exchangeFilter && k.isActive)
    : keys.filter((k) => k.isActive);

  const handleAddNew = () => {
    router.push("/terminal/settings/api-keys");
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0
        bg-background z-[100]
        flex flex-col overflow-hidden
        animate-in fade-in slide-in-from-bottom-4 duration-200
      "
      style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-input flex-shrink-0">
        <Key className="w-4 h-4 text-foreground shrink-0" />
        <span className="text-foreground font-semibold text-xs flex-1">{title}</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div
        className="
          flex-1 min-h-0 overflow-y-auto p-3
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
        "
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground text-xs">Loading connections...</div>
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 rounded-full bg-input border border-border flex items-center justify-center">
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-sm font-medium mb-1">
                No API Keys Found
              </div>
              <div className="text-muted-foreground text-xs max-w-[240px]">
                Add your exchange API keys in Settings to connect your accounts.
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="
              flex items-center gap-2 px-4 py-2
            bg-[#1A73E8]/15 border border-[#1A73E8]/30
            text-[#1A73E8] text-xs font-medium
              rounded-md hover:bg-[#1A73E8]/25
              transition-colors cursor-pointer
              "
            >
              <Plus className="w-3.5 h-3.5" />
              Add API Key in Settings
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Info banner */}
            <div className="flex items-start gap-2 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-md mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-blue-400/80 text-[10px]">
                Select a saved connection to use with this tool. Manage keys in Settings.
              </div>
            </div>

            {filteredKeys.map((key) => {
              const isSelected = selectedKeyId === key.id;
              const isHovered = hoveredId === key.id;

              return (
                <button
                  key={key.id}
                  onClick={() => onSelect(key)}
                  onMouseEnter={() => setHoveredId(key.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`
                    w-full text-left p-3 rounded-md
                    border transition-all cursor-pointer
                    ${isSelected
                      ? "bg-emerald-500/15 border-emerald-500/40"
                      : isHovered
                        ? "bg-black/8 dark:bg-white/8 border-border"
                        : "bg-input border-border"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] uppercase font-semibold shrink-0">
                      {key.exchange}
                    </span>
                    <span className="text-foreground text-xs font-medium truncate flex-1">
                      {maskKey(key.label, key.exchange)}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {key.permissions.map((perm) => {
                      const style = PERM_STYLE[perm];
                      if (!style) {
                        return (
                          <span key={perm} className="px-1 py-0.5 rounded text-[9px] bg-secondary text-muted-foreground">
                            {perm}
                          </span>
                        );
                      }
                      const Icon = style.icon;
                      return (
                        <span
                          key={perm}
                          className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium ${style.bg} ${style.color}`}
                        >
                          <Icon className="w-2 h-2" />
                          {perm === "internal_transfer" ? "Transfer" : perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </span>
                      );
                    })}
                    {key.permissions.includes("withdraw") && (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium bg-red-500/10 text-red-400">
                        <ShieldAlert className="w-2 h-2" />
                      </span>
                    )}
                    <span className="text-muted-foreground text-[9px]">·</span>
                    <span className="text-muted-foreground text-[9px]">
                      {formatLastUsed(key.lastUsedAt)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex-shrink-0 flex items-center gap-2">
        <button
          onClick={handleAddNew}
          className="
            flex-1 flex items-center justify-center gap-2
            h-9 rounded-md
            bg-input border border-border
            text-muted-foreground text-xs font-medium
            hover:bg-black/10 dark:hover:bg-secondary hover:text-foreground
            transition-colors cursor-pointer
          "
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Manage API Keys
        </button>
      </div>
    </div>
  );
}
