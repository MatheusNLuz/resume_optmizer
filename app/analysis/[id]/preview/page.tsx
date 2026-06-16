import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BasicAtsTemplate } from "@/components/preview/basic-ats-template";
import { ModernAtsTemplate } from "@/components/preview/modern-ats-template";

export default async function PreviewPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ export?: string }>;
}) {
  const { id } = await params;
  const { export: isExport } = await searchParams;

  const analysis = await prisma.analysis.findUnique({ where: { id } });
  if (!analysis || !analysis.finalResumeJson) return notFound();

  const resume = JSON.parse(analysis.finalResumeJson);
  const isExportBool = isExport === "true";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Remove o topbar/header do layout base durante o preview e impressão */
        header { display: none !important; }
        body { background: white !important; }
        main { padding: 0 !important; }
      `}} />
      {analysis.selectedTemplate === "modern-ats" ? (
        <ModernAtsTemplate resume={resume} isExport={isExportBool} language={analysis.selectedLanguage} />
      ) : (
        <BasicAtsTemplate resume={resume} isExport={isExportBool} language={analysis.selectedLanguage} />
      )}
    </>
  );
}
