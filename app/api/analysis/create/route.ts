import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, jobLocation, selectedLanguage } = body;

    if (!mode) {
      return NextResponse.json({ error: "Mode is required" }, { status: 400 });
    }

    // Create the analysis record first
    const analysis = await prisma.analysis.create({
      data: {
        mode,
        selectedLanguage: selectedLanguage || "unknown",
        selectedTemplate: "basic-ats",
        resumeInputType: "PDF_UPLOAD",
      },
    });

    // Save jobLocation via raw SQL since prisma client may not have the field typed yet
    if (jobLocation) {
      await prisma.$executeRawUnsafe(
        `UPDATE Analysis SET jobLocation = ? WHERE id = ?`,
        jobLocation,
        analysis.id
      );
    }

    return NextResponse.json({ ...analysis, jobLocation: jobLocation || null });
  } catch (error) {
    console.error("Error creating analysis:", error);
    return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 });
  }
}
