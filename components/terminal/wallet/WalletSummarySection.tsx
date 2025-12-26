import Section from "./Section";
import InfoRow from "./InfoRow";

export default function WalletSummarySection() {
  return (
    <Section title="Cüzdan Özeti">
      <InfoRow label="Adres" value="0x742d...8f3a" />
      <InfoRow label="Etiket" value="Whale #142" />
      <InfoRow label="Bakiye" value="1,845 BTC" />
      <InfoRow label="USD Değer" value="$170.2M" />
      <InfoRow label="İlk İşlem" value="2019-03-14" />
    </Section>
  );
}
