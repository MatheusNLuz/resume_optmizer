import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { analysisId, answers } = await req.json();
    if (!analysisId || !answers) {
      return NextResponse.json({ error: "Missing analysisId or answers" }, { status: 400 });
    }

    // answers is an object: { [questionId]: answerText }
    for (const [qId, answer] of Object.entries(answers)) {
      await prisma.smartQuestion.update({
        where: { id: qId },
        data: { answer: answer as string }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving smart question answers:", error);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }
}
