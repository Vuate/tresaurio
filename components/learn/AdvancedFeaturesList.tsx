import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: "🎨",
    title: "Infinite Canvas Dashboard",
    desc: "Sonsuz tuval üzerinde kendi dashboard'unuzu oluşturun. Drag & drop modüller, mini-map navigasyon, zoom controls. Her şey tam istediğiniz yerde.",
    tags: ["Drag & Drop", "Customizable", "Mini-Map"],
  },
  {
    icon: "📝",
    title: "Smart Notes",
    desc: "Dashboard'a yerleştirdiğiniz notlar içinde coin ticker'ı yazın, otomatik olarak fiyatı çeksin. Real-time price tracking notlarınızda.",
    tags: ["Auto Price", "Live Updates"],
  },
  {
    icon: "🔔",
    title: "Comprehensive Alert System",
    desc: "Fiyat, hacim, funding, spread, wallet band, OI spike - her şey için alert kurabilirsiniz. Email, Telegram, SMS, Push notification desteği.",
    tags: ["Multi-Channel", "Custom Triggers"],
  },
];

export default function AdvancedFeaturesList() {
  return (
    <>
      {FEATURES.map((item) => (
        <FeatureCard key={item.title} {...item} />
      ))}
    </>
  );
}
