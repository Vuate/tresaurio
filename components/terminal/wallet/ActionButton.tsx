export default function ActionButton({
  label,
  primary = false,
  onClick,
}: {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition cursor-pointer
        ${
          primary
            ? "bg-gradient-to-br from-teal-400 to-teal-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-400/30"
            : "border border-white/10 bg-white/5 text-white hover:border-teal-400/40 hover:bg-white/10"
        }`}
    >
      {label}
    </button>
  );
}
