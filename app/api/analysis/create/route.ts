import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, jobLocation, selectedLanguage } = body;

    if (!mode) {
      return NextResponse.json({ error: "Mode is required" }, { status: 400 });
    }

    // Create the analysis record
    const analysis = await prisma.analysis.create({
      data: {
        mode,
        selectedLanguage: selectedLanguage || "unknown",
        selectedTemplate: "basic-ats",
        resumeInputType: "PDF_UPLOAD",
        jobLocation: jobLocation || null,
      },
    });

    return NextResponse.json({ ...analysis, jobLocation: jobLocation || null });
  } catch (error) {
    console.error("Error creating analysis:", error);
    return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 });
  }
}
