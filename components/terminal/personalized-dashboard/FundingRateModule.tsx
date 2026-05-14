"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import type { Exchange } from "@/services/WebSocketService";

interface FundingData {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  markPrice: number;
  indexPrice: number;
  source: "websocket" | "api";
  exchange: string;
}

interface Props {
  instanceId: string;
}

const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

const POPULAR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LINKUSDT",
  "UNIUSDT",
  "ATOMUSDT",
  "LTCUSDT",
  "NEARUSDT",
];

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

const getWebSocketUrl = (exchange: Exchange): string => {
  switch (exchange) {
    case "binance":
      return `wss://fstream.binance.com/ws`;
    case "okx":
      return `wss://ws.okx.com:8443/ws/v5/public`;
    case "bybit":
      return `wss://stream.bybit.com/v5/public/linear`;
    default:
      return "";
  }
};

const formatSymbol = (symbol: string, exchange: Exchange): string => {
  const upper = symbol.toUpperCase();
  switch (exchange) {
    case "binance":
    case "bybit":
      return upper;
    case "okx":
      return upper.replace(/^([A-Z]+)(USDT|USDC|USD)$/, "$1-$2") + "-SWAP";
    default:
      return upper;
  }
};

const buildSubscribeMessage = (exchange: Exchange, symbol: string): any => {
  const formattedSymbol = formatSymbol(symbol, exchange);
  const lowerSymbol = symbol.toLowerCase();

  switch (exchange) {
    case "binance":
      return {
        method: "SUBSCRIBE",
        params: [`${lowerSymbol}@markPrice`],
        id: Date.now(),
      };
    case "okx":
      return {
        op: "subscribe",
        args: [
          { channel: "funding-rate", instId: formattedSymbol },
          { channel: "mark-price", instId: formattedSymbol },
        ],
      };
    case "bybit":
      return {
        op: "subscribe",
        args: [`tickers.${formattedSymbol}`],
      };
    default:
      return null;
  }
};

const parseMessage = (
  exchange: Exchange,
  data: any,
  symbol: string,
): Partial<FundingData> | null => {
  try {
    switch (exchange) {
      case "binance":
        if (data.e === "markPriceUpdate") {
          return {
            symbol: data.s,
            fundingRate: parseFloat(data.r || "0"),
            fundingTime: data.T || Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parseFloat(data.p || "0"),
            indexPrice: parseFloat(data.i || data.p || "0"),
            source: "websocket",
            exchange: "Binance",
          };
        }
        break;

      case "okx":
        if (data.arg?.channel === "funding-rate" && data.data?.[0]) {
          const d = data.data[0];
          return {
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: parseInt(d.nextFundingTime),
            source: "websocket",
            exchange: "OKX",
          };
        }
        if (data.arg?.channel === "mark-price" && data.data?.[0]) {
          const d = data.data[0];
          return {
            markPrice: parseFloat(d.markPx || "0"),
            indexPrice: parseFloat(d.markPx || "0"),
            source: "websocket",
            exchange: "OKX",
          };
        }
        break;

      case "bybit":
        if (data.topic?.includes("tickers") && data.data) {
          const d = data.data;
          return {
            symbol: d.symbol,
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: parseInt(d.nextFundingTime) || Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parseFloat(d.markPrice || "0"),
            indexPrice: parseFloat(d.indexPrice || "0"),
            source: "websocket",
            exchange: "Bybit",
          };
        }
        break;
    }
  } catch (err) {
    console.error("[FundingRate] Parse error:", err);
  }
  return null;
};

export default function FundingRateModule({ instanceId }: Props) {
  const storageKey = `funding-rate-${instanceId}`;
  const symbolsStorageKey = `funding-rate-symbols-${instanceId}`;

  const [symbols, setSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(symbolsStorageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_SYMBOLS;
  });

  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [data, setData] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [symbolOpen, setSymbolOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    localStorage.setItem(symbolsStorageKey, JSON.stringify(symbols));
  }, [symbols, symbolsStorageKey]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const s = JSON.parse(saved);
      if (s.symbol) setSelectedSymbol(s.symbol);
      if (s.exchange) setExchange(s.exchange);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ symbol: selectedSymbol, exchange }),
    );
  }, [selectedSymbol, exchange, storageKey]);

  // Exchange dropdown outside click
  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeRef.current &&
        !exchangeRef.current.contains(e.target as Node)
      ) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  // Symbol dropdown outside click
  useEffect(() => {
    if (!symbolOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        symbolRef.current &&
        !symbolRef.current.contains(e.target as Node)
      ) {
        setSymbolOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [symbolOpen]);

  //  Modal scroll lock
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = 'hidden';
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (contentRef.current) {
        contentRef.current.style.overflow = '';
      }
    };
  }, [showAddModal]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const url = getWebSocketUrl(exchange);
    if (!url) return;

    console.log(`🔌 [FundingRate] Connecting to ${exchange.toUpperCase()}...`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);

      const subscribeMsg = buildSubscribeMessage(exchange, selectedSymbol);
      if (subscribeMsg) {
        ws.send(JSON.stringify(subscribeMsg));
        console.log(`📤 [FundingRate] Sent subscribe:`, subscribeMsg);
      }
    };

    ws.onmessage = (e) => {
      try {
        const raw = JSON.parse(e.data);

        if (exchange === "bybit" && raw.op === "ping") {
          ws.send(JSON.stringify({ op: "pong" }));
          return;
        }
        if (exchange === "okx" && raw.event === "ping") {
          ws.send(JSON.stringify({ event: "pong" }));
          return;
        }

        if (raw.event === "subscribe" || raw.op === "subscribe" || raw.success === true) {
          console.log(`✅ [FundingRate] Subscription confirmed for ${exchange}`);
          return;
        }

        const parsed = parseMessage(exchange, raw, selectedSymbol);

        if (parsed) {
          setLoading(false);

          setData((prev) => ({
            symbol: selectedSymbol,
            fundingRate: parsed.fundingRate ?? prev?.fundingRate ?? 0,
            fundingTime:
              parsed.fundingTime ??
              prev?.fundingTime ??
              Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parsed.markPrice ?? prev?.markPrice ?? 0,
            indexPrice: parsed.indexPrice ?? prev?.indexPrice ?? 0,
            source: "websocket",
            exchange: parsed.exchange ?? exchange,
          }));
        }
      } catch (err) {
        console.error("[FundingRate] Message parse error:", err);
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connectWebSocket, 5000);
    };
  }, [exchange, selectedSymbol]);

  useEffect(() => {
    setLoading(true);
    setData(null);
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [connectWebSocket]);

  const timeUntilFunding = data
    ? Math.max(0, data.fundingTime - Date.now())
    : 0;
  const hours = Math.floor(timeUntilFunding / 3_600_000);
  const minutes = Math.floor((timeUntilFunding % 3_600_000) / 60_000);
  const fundingRatePercent = data ? data.fundingRate * 100 : 0;
  const annualizedRate = fundingRatePercent * 3 * 365;

  return (
    <div className={`h-full flex flex-col relative ${showAddModal ? 'overflow-hidden' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-foreground text-xs whitespace-nowrap">
          Funding Rate
        </span>
        <span className="text-muted-foreground text-xs">•</span>
        
        {connected ? (
          <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>
        ) : loading ? (
          <span className="text-yellow-400 text-xs whitespace-nowrap animate-pulse">CONNECTING</span>
        ) : null}

        <div className="flex-1 min-w-[20px]"></div>

        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
            bg-card 
              border border-border
              text-foreground text-xs
              flex items-center gap-1.5
              cursor-pointer
              transition-all
              whitespace-nowrap
            "
          >
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
            <span
              className={`
                text-muted-foreground text-[10px]
                transition-transform duration-200
                ${exchangeOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

{exchangeOpen && (() => {
  const buttonRect = exchangeRef.current?.getBoundingClientRect();
  const dropdownWidth = 120;
  
  const wouldOverflowRight = buttonRect 
    ? (buttonRect.left + dropdownWidth) > window.innerWidth 
    : false;
  
  const wouldOverflowLeft = buttonRect
    ? buttonRect.right < dropdownWidth
    : false;
  
  let openFromRight = false;
  
  if (wouldOverflowRight && !wouldOverflowLeft) {
    openFromRight = true;
  } else if (!wouldOverflowRight && wouldOverflowLeft) {
    openFromRight = false;
  } else {
    openFromRight = buttonRect ? buttonRect.left > (window.innerWidth / 2) : false;
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        marginTop: '0.25rem',
        zIndex: 50,
        width: '120px',
        maxHeight: '160px',
        ...(openFromRight ? { right: 0 } : { left: 0 })
      }}
      className="
        overflow-y-auto
       bg-card
        border border-emerald-500/20
        rounded-md
        shadow-lg
        animate-in fade-in slide-in-from-top-2 duration-200

        [&::-webkit-scrollbar]:w-1.5
       [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
      "
    >
      {EXCHANGES.map((ex) => (
        <button
          key={ex.id}
          onClick={() => {
            setExchange(ex.id as Exchange);
            setExchangeOpen(false);
          }}
          className="
            w-full px-3 py-2
            text-left text-xs
            bg-transparent cursor-pointer
            text-foreground
            transition-colors
          hover:text-[#1A73E8]/65

          "
        >
          {ex.name}
        </button>
      ))}
    </div>
  );
})()}

        </div>

        <div ref={symbolRef} className="relative">
          <button
            onClick={() => setSymbolOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
            bg-card
              border border-border
              text-foreground text-xs
              flex items-center gap-1.5
              cursor-pointer
              transition-all
              whitespace-nowrap
            "
          >
            <span>{selectedSymbol}</span>
            <span
              className={`
                text-muted-foreground text-[10px]
                transition-transform duration-200
                ${symbolOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

{symbolOpen && (() => {
  const buttonRect = symbolRef.current?.getBoundingClientRect();
  const dropdownWidth = 140;
  
  const wouldOverflowRight = buttonRect 
    ? (buttonRect.left + dropdownWidth) > window.innerWidth 
    : false;
  
  const wouldOverflowLeft = buttonRect
    ? buttonRect.right < dropdownWidth
    : false;
  
  let openFromRight = false;
  
  if (wouldOverflowRight && !wouldOverflowLeft) {
    openFromRight = true;
  } else if (!wouldOverflowRight && wouldOverflowLeft) {
    openFromRight = false;
  } else {
    openFromRight = buttonRect ? buttonRect.left > (window.innerWidth / 2) : false;
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        marginTop: '0.25rem',
        zIndex: 50,
        width: '140px',
        maxHeight: '200px',
        ...(openFromRight ? { right: 0 } : { left: 0 })
      }}
      className="
        overflow-y-auto
       bg-card border border-border

        rounded-md
        shadow-lg
        animate-in fade-in slide-in-from-top-2 duration-200

        [&::-webkit-scrollbar]:w-1.5
       [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
      "
    >
      {symbols.map((s) => (
        <button
          key={s}
          onClick={() => {
            setSelectedSymbol(s);
            setSymbolOpen(false);
          }}
          className="
            w-full px-3 py-2
            text-left text-xs
            bg-transparent cursor-pointer
            text-foreground
            transition-colors
          hover:text-[#1A73E8]/65

          "
        >
          {s}
        </button>
      ))}
    </div>
  );
})()}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 rounded-md bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/50 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 hover:bg-blue-500/25 dark:hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto
          space-y-2

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40          [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb:hover]:bg-black/50 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60

          scrollbar-thin
scrollbar-thumb-foreground/40          scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
        "
      >
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-black/20 dark:border-white/20 border-t-blue-400 rounded-full animate-spin mb-2" />
            <span className="text-[11px]">Connecting to {exchange.toUpperCase()}...</span>
          </div>
        )}

        {!loading && !data && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="w-5 h-5 mb-2 text-yellow-400/60" />
            <span className="text-[11px]">No data from {exchange.toUpperCase()}</span>
          </div>
        )}

        {data && (
          <>
            {/* Current Funding Rate */}
            <div className="bg-input border border-border rounded-md p-2">
              <div className="text-muted-foreground mb-0.5 text-[9px] leading-tight">Current Funding Rate</div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-base font-bold leading-none break-all ${
                    fundingRatePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {fundingRatePercent >= 0 ? "+" : ""}
                  {fundingRatePercent.toFixed(4)}%
                </span>
                <span className="text-muted-foreground text-[9px] leading-none">
                  ({annualizedRate.toFixed(1)}% APR)
                </span>
              </div>
            </div>

            {/* Next Funding */}
            <div className="bg-input border border-border rounded-md p-2">
              <div className="flex items-center gap-1 text-muted-foreground mb-0.5 text-[9px] leading-tight">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                Next Funding In
              </div>
              <div className="text-sm font-bold text-foreground leading-none">
                {hours}h {minutes}m
              </div>
            </div>

            {/* Sentiment */}
            <div className="bg-input border border-border rounded-md p-2 flex flex-wrap justify-between items-center gap-2">
              <span className="text-muted-foreground text-[9px] leading-tight">Market Sentiment</span>
              <span
                className={`font-semibold flex items-center gap-0.5 text-[10px] leading-tight whitespace-nowrap ${
                  fundingRatePercent > 0.01
                    ? "text-emerald-400"
                    : fundingRatePercent < -0.01
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              >
                {fundingRatePercent > 0.01 ? (
                  <>
                    <TrendingUp className="w-2.5 h-2.5" /> Bullish
                  </>
                ) : fundingRatePercent < -0.01 ? (
                  <>
                    <TrendingDown className="w-2.5 h-2.5" /> Bearish
                  </>
                ) : (
                  "Neutral"
                )}
              </span>
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <div 
          className="
            fixed inset-0
            bg-background z-[100]
            flex flex-col overflow-hidden
            animate-in fade-in slide-in-from-bottom-4 duration-200
          "
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-border bg-input flex-shrink-0">
            <span className="text-foreground font-semibold text-xs whitespace-nowrap">
              Add Symbol
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-muted-foreground hover:text-foreground leading-none cursor-pointer transition-colors text-xl ml-auto"
            >
              ×
            </button>
          </div>

          <div
            className="
              flex-1 min-h-0 overflow-y-auto p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
       [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40
              [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/50 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60
              scrollbar-thin
scrollbar-thumb-foreground/40              scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-muted-foreground font-medium text-[10px]">
                  Add Custom Symbol
                </label>
                <input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const symbol = newSymbol.trim().toUpperCase();
                      if (!symbol || symbols.includes(symbol)) return;
                      setSymbols((p) => [...p, symbol]);
                      setSelectedSymbol(symbol);
                      setNewSymbol("");
                      setShowAddModal(false);
                    }
                  }}
                  placeholder="Enter symbol (e.g. BTCUSDT)"
                  className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
                <div className="text-muted-foreground text-[10px]">
                  💡 Example: BTCUSDT, ETHUSDT
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-2 font-medium text-[10px]">
                  Popular Symbols
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SYMBOLS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSymbols((p) => p.includes(s) ? p : [...p, s]);
                        setSelectedSymbol(s);
                        setShowAddModal(false);
                      }}
                      className={`
                        px-2 py-1.5 rounded-md font-semibold text-[10px]
                        border transition-all duration-150
                        cursor-pointer
                        whitespace-nowrap
                        ${
                          symbols.includes(s)
                    ? "bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50"
                            : `
                    bg-secondary text-muted-foreground border-border
                      hover:text-[#1A73E8]

                              `
                        }
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  const symbol = newSymbol.trim().toUpperCase();
                  if (!symbol || symbols.includes(symbol)) return;
                  setSymbols((p) => [...p, symbol]);
                  setSelectedSymbol(symbol);
                  setNewSymbol("");
                  setShowAddModal(false);
                }}
                disabled={!newSymbol.trim()}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground rounded-md font-semibold transition-all cursor-pointer text-xs"
              >
                Add Custom Symbol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}