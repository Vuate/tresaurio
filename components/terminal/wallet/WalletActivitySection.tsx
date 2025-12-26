import Section from "./Section";
import InfoRow from "./InfoRow";

export default function WalletActivitySection() {
  return (
    <Section title="Son 24s Aktivite">
      <InfoRow label="Giriş" value="+125 BTC" valueColor="text-emerald-400" />
      <InfoRow label="Çıkış" value="-320 BTC" valueColor="text-red-400" />
      <InfoRow label="Net" value="-195 BTC" valueColor="text-red-400" />
      <InfoRow label="İşlem Sayısı" value="8" />
    </Section>
  );
}