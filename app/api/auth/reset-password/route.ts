// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalı" },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!resetToken || !resetToken.identifier.startsWith("reset:")) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expires) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Şifre sıfırlama linkinin süresi dolmuş" },
        { status: 400 }
      );
    }

    // Extract email from identifier
    const email = resetToken.identifier.replace("reset:", "");

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: "Şifreniz başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
