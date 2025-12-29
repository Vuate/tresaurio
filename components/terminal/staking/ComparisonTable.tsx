export default function ComparisonTable() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6 overflow-x-auto">
      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
        📊 Platform Karşılaştırması - BTC Staking
      </h3>
      <p className="text-xs text-gray-400 mb-6">
        Son güncelleme: 2 dakika önce
      </p>

      <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-px bg-white/10 rounded-xl overflow-hidden text-sm min-w-[900px]">
        {/* HEADER */}
        <Cell header>ÖZELLİK</Cell>
        <Platform name="BINANCE" />
        <Platform name="OKX" />
        <Platform name="BYBIT" />
        <Platform name="KRAKEN" />

        {/* APR */}
        <RowLabel>💰 APR Oranı</RowLabel>
        <Value highlight className="text-emerald-400">5.2%</Value>
        <Value>4.8%</Value>
        <Value>4.5%</Value>
        <Value>3.9%</Value>

        {/* STAKE TYPE */}
        <RowLabel>📝 Stake Türü</RowLabel>
        <Badge color="teal">Flexible</Badge>
        <Badge color="yellow">Locked 30d</Badge>
        <Badge color="teal">Flexible</Badge>
        <Badge color="yellow">Locked 90d</Badge>

        {/* MIN */}
        <RowLabel>🔢 Min. Miktar</RowLabel>
        <Value highlight>0.001 BTC</Value>
        <Value>0.01 BTC</Value>
        <Value>0.001 BTC</Value>
        <Value>0.005 BTC</Value>

        {/* LOCK */}
        <RowLabel>🔒 Kilit Süresi</RowLabel>
        <Value highlight>Yok</Value>
        <Value>30 gün</Value>
        <Value>Yok</Value>
        <Value>90 gün</Value>

        {/* UNSTAKE */}
        <RowLabel>⏱️ Unstake Süresi</RowLabel>
        <Value highlight>Anında</Value>
        <Value>Vade sonunda</Value>
        <Value>Anında</Value>
        <Value>Vade sonunda</Value>

        {/* PENALTY */}
        <RowLabel>⚠️ Erken Çıkış Cezası</RowLabel>
        <Value>-</Value>
        <Value>%50 reward kaybı</Value>
        <Value>-</Value>
        <Value>Tüm reward iptal</Value>

        {/* REWARD */}
        <RowLabel>🎁 Reward Dağıtımı</RowLabel>
        <Value>Günlük</Value>
        <Value>Vade sonunda</Value>
        <Value>Günlük</Value>
        <Value>Haftalık</Value>

        {/* AUTO CLAIM */}
        <RowLabel>🤖 Otomatik Claim</RowLabel>
        <Badge color="green">Evet</Badge>
        <Badge color="orange">Hayır</Badge>
        <Badge color="green">Evet</Badge>
        <Badge color="orange">Hayır</Badge>

        {/* RISK */}
        <RowLabel>🛡️ Risk Seviyesi</RowLabel>
        <Dot color="green" label="Düşük" />
        <Dot color="green" label="Düşük" />
        <Dot color="yellow" label="Orta" />
        <Dot color="green" label="Düşük" />

        {/* TRUST */}
        <RowLabel>⭐ Güven Skoru</RowLabel>
        <Value highlight>9.5/10</Value>
        <Value>9.2/10</Value>
        <Value>8.8/10</Value>
        <Value>9.3/10</Value>
      </div>
    </div>
  );
}

/* ---- HELPERS ---- */

interface CellProps {
  children: React.ReactNode;
  header?: boolean;
  className?: string;
}

function Cell({ children, header, className = "" }: CellProps) {
  return (
    <div className={`p-4 ${header ? "bg-[#031a1c] font-bold" : "bg-[#041f20]"} ${className}`}>
      {children}
    </div>
  );
}

interface RowLabelProps {
  children: React.ReactNode;
}

function RowLabel({ children }: RowLabelProps) {
  return <Cell>{children}</Cell>;
}

interface ValueProps {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

function Value({ children, highlight, className = "" }: ValueProps) {
  return (
    <Cell className={`${highlight ? "bg-teal-400/10 border border-teal-400/30" : ""} ${className}`}>
      <div className="text-center">{children}</div>
    </Cell>
  );
}

function Platform({ name }: { name: string }) {
  return (
    <Cell header>
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-300 to-teal-600" />
        <span>{name}</span>
      </div>
    </Cell>
  );
}

type BadgeColor = "green" | "orange" | "yellow" | "teal";

interface BadgeProps {
  children: React.ReactNode;
  color: BadgeColor;
}

function Badge({ children, color }: BadgeProps) {
  const map: Record<BadgeColor, string> = {
    green: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
    orange: "bg-orange-400/10 text-orange-400 border-orange-400/30",
    yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    teal: "bg-teal-400/10 text-teal-300 border-teal-400/30",
  };

  return (
    <Cell>
      <div className={`mx-auto w-fit rounded-md border px-3 py-1 text-xs font-semibold ${map[color]}`}>
        {children}
      </div>
    </Cell>
  );
}

type DotColor = "green" | "yellow";

interface DotProps {
  color: DotColor;
  label: string;
}

function Dot({ color, label }: DotProps) {
  const map: Record<DotColor, string> = {
    green: "bg-emerald-400",
    yellow: "bg-yellow-400",
  };

  return (
    <Cell>
      <div className="flex items-center justify-center gap-2">
        <span className={`w-2 h-2 rounded-full ${map[color]}`} />
        <span>{label}</span>
      </div>
    </Cell>
  );
}
