// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalı" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with emailVerified set (skip email verification)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(), // Auto-verify user
      },
    });

    return NextResponse.json(
      {
        message: "Hesap oluşturuldu. Giriş yapabilirsiniz.",
        requiresVerification: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
