import { EditorClient } from "./client";

export default async function AnalysisEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditorClient analysisId={id} />;
}
