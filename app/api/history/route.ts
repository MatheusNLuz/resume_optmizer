import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const history = await prisma.analysis.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        mode: true,
        professionalTarget: true,
        selectedLanguage: true,
        createdAt: true,
        initialScores: true,
        finalScores: true,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
