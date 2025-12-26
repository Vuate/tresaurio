import Section from "./Section";
import Tag from "./Tag";

export default function WalletTagsSection() {
  return (
    <Section title="Etiketler">
      <div className="flex flex-wrap gap-2">
        <Tag label="Whale" />
        <Tag label="Long-term Holder" />
        <Tag label="Active Trader" />
      </div>
    </Section>
  );
}
