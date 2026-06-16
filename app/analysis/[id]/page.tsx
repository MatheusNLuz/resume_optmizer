import { AnalysisDashboardClient } from "./client";

export default async function AnalysisDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AnalysisDashboardClient analysisId={id} />;
}
