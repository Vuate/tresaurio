"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
            Treasurio
          </h1>
          <p className="text-gray-400">
            Likidite, Risk ve Veri Analitiği Platformu
          </p>
        </div>

        <div className="text-gray-500 text-sm">Son güncelleme: {time}</div>
      </div>
    </header>
  );
}
