import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let body: Record<string, string>;
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    const formData = await req.formData();
    body = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, v.toString()])
    );
  }

  const lang = body.lang === "tr" ? "tr" : "en";
  const msgs = {
    tr: {
      required: "Ad Soyad ve E-posta zorunludur.",
      invalid_email: "Geçersiz e-posta adresi.",
      success: "Kaydınız alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
    },
    en: {
      required: "Full name and email are required.",
      invalid_email: "Invalid email address.",
      success: "Registration received. We will contact you as soon as possible.",
      error: "An error occurred. Please try again.",
    },
  };
  const m = msgs[lang];

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const telegram = body.telegram?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email) {
    return NextResponse.json({ success: false, message: m.required }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: m.invalid_email }, { status: 400 });
  }

  let dbSaved = false;
  try {
    await prisma.earlyAccess.create({
      data: { name, email, telegram: telegram || null, message: message || null, ipAddress: ip },
    });
    dbSaved = true;
  } catch (err) {
    console.error("[submit-form] DB error:", err);
  }

  let mailSent = false;
  try {
    await transporter.sendMail({
      from: `"Treasurio" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: "Yeni Başvuru - Treasurio",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9">
          <div style="background:linear-gradient(135deg,#2563EB,#00C8FF);padding:20px;text-align:center;color:white;border-radius:8px 8px 0 0">
            <h2 style="margin:0">Yeni Başvuru</h2>
            <p style="margin:4px 0 0">Treasurio.xyz üzerinden yeni başvuru</p>
          </div>
          <div style="background:white;padding:20px;border-radius:0 0 8px 8px">
            <p><strong>Ad Soyad:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telegram:</strong> ${telegram || "Belirtilmemiş"}</p>
            <p><strong>Mesaj:</strong> ${message || "Mesaj yok"}</p>
          </div>
          <p style="text-align:center;color:#999;font-size:11px;margin-top:16px">
            Tarih: ${new Date().toLocaleString("tr-TR")} | IP: ${ip}
          </p>
        </div>
      `,
    });
    mailSent = true;
  } catch (err) {
    console.error("[submit-form] Mail error:", err);
  }

  if (dbSaved || mailSent) {
    return NextResponse.json({ success: true, message: m.success });
  }

  return NextResponse.json({ success: false, message: m.error }, { status: 500 });
}
