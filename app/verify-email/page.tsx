"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    "missing-token": "Doğrulama linki geçersiz.",
    "invalid-token": "Doğrulama linki geçersiz veya daha önce kullanılmış.",
    "expired-token": "Doğrulama linkinin süresi dolmuş. Lütfen yeni bir link isteyin.",
    "user-not-found": "Kullanıcı bulunamadı.",
    "server-error": "Bir hata oluştu. Lütfen tekrar deneyin.",
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
          {success === "true" ? (
            <>
              {/* Success Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                E-posta Doğrulandı!
              </h1>
              <p className="text-gray-400 mb-6">
                Hesabınız başarıyla aktif edildi. Şimdi giriş yapabilirsiniz.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-gray-100 transition"
              >
                Giriş Yap
              </Link>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Doğrulama Başarısız
              </h1>
              <p className="text-gray-400 mb-6">
                {errorMessages[error] || "Bir hata oluştu."}
              </p>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="inline-block w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                E-postanızı Kontrol Edin
              </h1>
              <p className="text-gray-400 mb-6">
                Hesabınızı aktif etmek için e-postanıza gönderilen doğrulama linkine tıklayın.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition"
              >
                Ana Sayfaya Dön
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
          <div className="text-white">Yükleniyor...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
