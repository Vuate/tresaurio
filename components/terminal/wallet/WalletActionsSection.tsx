import Section from "./Section";
import ActionButton from "./ActionButton";

export default function WalletActionsSection({
  onAlertClick,
}: {
  onAlertClick?: () => void;
}) {
  return (
    <Section title="Hızlı İşlemler">
      <ActionButton
        primary
        label="🔔 Bu Cüzdan için Alert Kur"
        onClick={onAlertClick}
      />
      <ActionButton label="⭐ Watchlist'e Ekle" />
      <ActionButton label="📊 Detaylı Analiz" />
      <ActionButton label="🔗 Explorer'da Aç" />
    </Section>
  );
}
