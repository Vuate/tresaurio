"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAlertStore } from "@/store/alertStore";
import { usePriceStore } from "@/store/priceStore";
import { Bell } from "lucide-react";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import NotificationPopup from "@/components/terminal/personalized-dashboard/NotificationPopup";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

interface Props {
  instanceId: string;
}

export default function CreateAlertModule({ instanceId }: Props) {
  const addAlert = useAlertStore((s) => s.addAlert);

  const [symbolOpen, setSymbolOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const symbolRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        symbolRef.current &&
        !symbolRef.current.contains(e.target as Node)
      ) {
        setSymbolOpen(false);
      }

      if (
        conditionRef.current &&
        !conditionRef.current.contains(e.target as Node)
      ) {
        setConditionOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");

  const handleCreateAlert = () => {
    if (!target) {
      setNotification({
        show: true,
        type: "error",
        title: "Empty Alert",
        message: "Please enter a target price",
      });
      return;
    }

    addAlert({
      symbol,
      condition,
      target: Number(target),
    });

    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Alert Created",
      description: `${symbol} ${condition} ${target}`,
    });

    setTarget("");
  };

  return (
    <>
      {typeof window !== "undefined" &&
        createPortal(
          <NotificationPopup
            show={notification.show}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />,
          document.body
        )}

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-white/90">
          <Bell className="w-4 h-4" />
          <span>Create Price Alert</span>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px] font-semibold">
            Symbol
          </label>
          <div ref={symbolRef} className="relative">
            <button
              onClick={() => setSymbolOpen((v) => !v)}
              className="
                w-full h-9
                flex items-center justify-between
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-none px-3
                text-white text-xs
                cursor-pointer
              "
            >
              <span>{symbol}</span>
              <span
                className={`transition-transform ${symbolOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {symbolOpen && (
              <div
                className="
                  absolute z-50 mt-1 w-full
                  max-h-[96px] overflow-y-auto
                  bg-[#0b1f1f]
                  border border-emerald-500/20
                  rounded-none

                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                  [&::-webkit-scrollbar-thumb]:rounded-full
                "
              >
                {SYMBOLS.map((s) => {
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSymbol(s);
                        setSymbolOpen(false);
                      }}
                      className="
                        w-full px-3 py-2
                        text-left text-xs
                        cursor-pointer
                        bg-transparent
                        text-white
                        transition-colors
                        hover:text-emerald-400
                      "
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px] font-semibold">
            Condition
          </label>
          <div ref={conditionRef} className="relative">
            <button
              onClick={() => setConditionOpen((v) => !v)}
              className="
                w-full h-9
                flex items-center justify-between
                bg-[#0b1f1f]
                border border-white/10
                rounded-none px-3
                text-white text-xs
                cursor-pointer
              "
            >
              <span>{condition === "above" ? "Price Above" : "Price Below"}</span>
              <span
                className={`transition-transform ${conditionOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {conditionOpen && (
              <div className="absolute z-50 mt-1 w-full bg-[#0b1f1f] border border-white/10 rounded-none">
                <button
                  onClick={() => {
                    setCondition("above");
                    setConditionOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    cursor-pointer
                    text-white
                    transition-colors
                    hover:text-emerald-400
                  "
                >
                  Price Above
                </button>

                <button
                  onClick={() => {
                    setCondition("below");
                    setConditionOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    cursor-pointer
                    text-white
                    transition-colors
                    hover:text-emerald-400
                  "
                >
                  Price Below
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px] font-semibold">
            Target Price
          </label>
          <input
            type="number"
            placeholder="Target price"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateAlert();
              }
            }}
            className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-xs outline-none"
          />
        </div>

        <button
          onClick={handleCreateAlert}
          className="w-full h-9 rounded-lg bg-teal-400/20 border border-teal-400/40 text-teal-300 hover:bg-teal-400/30 transition font-semibold cursor-pointer"
        >
          Create Alert
        </button>
      </div>
    </>
  );
}