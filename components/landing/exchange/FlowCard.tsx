export default function FlowCard({
  name,
  amount,
}: {
  name: string;
  amount: string;
}) {
  const positive = amount.startsWith("+");

  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <strong className="block text-white">{name}</strong>

      <div
        className={`mt-2 font-semibold ${
          positive ? "text-green-400" : "text-red-400"
        }`}
      >
        {amount}
      </div>
    </div>
  );
}
