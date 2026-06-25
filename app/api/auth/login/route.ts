import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 400 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 400 });
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Falha ao realizar login" }, { status: 500 });
  }
}
