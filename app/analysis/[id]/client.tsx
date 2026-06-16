"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/custom-toast";

interface Props { analysisId: string; }

export function AnalysisDashboardClient({ analysisId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("Loading...");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

// Translated lines only
  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      setStep("Verificando status...");
      const res = await fetch(`/api/analysis/${analysisId}`);
      if (!res.ok) throw new Error("Falha ao carregar registro da análise");
      const record = await res.json();

      if (!record.analysisJson) {
        setStep("Rodando análise de ATS...");
        const r = await fetch("/api/analyze", { method: "POST", body: JSON.stringify({ analysisId }), headers: { "Content-Type": "application/json" } });
        if (!r.ok) throw new Error("Análise de ATS falhou");
      }

      if (record.mode !== "MAKE_ATS_FRIENDLY" && record.jobDescription && !record.comparisonJson) {
        setStep("Comparando com a vaga...");
        const r = await fetch("/api/compare", { method: "POST", body: JSON.stringify({ analysisId }), headers: { "Content-Type": "application/json" } });
        if (!r.ok) throw new Error("Comparação falhou");
      }

      setStep("Concluído");
      const finalRes = await fetch(`/api/analysis/${analysisId}`);
      setAnalysisData(await finalRes.json());
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Análise falhou", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runAnalysis(); }, [analysisId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center">
          <p className="text-[14px] font-medium">{step}</p>
          <p className="text-[12px] text-muted-foreground">Isso pode levar alguns segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <div className="surface rounded-xl p-8 text-center max-w-sm">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <h2 className="text-[15px] font-semibold mb-1">Análise falhou</h2>
          <p className="text-[13px] text-muted-foreground mb-5">{error}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => router.push("/")} className="rounded-lg px-4 py-2 text-[13px] bg-secondary text-foreground hover:bg-secondary/80">Início</button>
            <button onClick={runAnalysis} className="rounded-lg px-4 py-2 text-[13px] bg-indigo-600 text-white hover:bg-indigo-500">Tentar Novamente</button>
          </div>
        </div>
      </div>
    );
  }

  const parse = (v: any) => typeof v === "string" ? JSON.parse(v) : v;
  const analysis = parse(analysisData.analysisJson);
  const gamification = parse(analysisData.gamificationJson);
  const scores = parse(analysisData.initialScores);
  const finalScores = parse(analysisData.finalScores);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Resultados da Análise</h1>
          <p className="text-[13px] text-muted-foreground">{analysisData.professionalTarget || "Otimização Geral"}</p>
        </div>
        <div className="flex items-center gap-2">
          {finalScores && (
            <Badge variant="outline" className="text-[12px] text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
              Otimizado
            </Badge>
          )}
          {gamification && (
            <Badge variant="secondary" className="text-[12px]">
              Nível {gamification.level}: {gamification.levelName}
            </Badge>
          )}
        </div>
      </div>

      {/* Optimization Banner */}
      {finalScores && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 text-[13.5px] text-emerald-300">
          <div>
            <span className="font-bold text-emerald-400">✨ Currículo otimizado com sucesso!</span> Suas respostas foram incorporadas. O score geral subiu de <span className="font-bold text-slate-400 line-through">{scores?.overall}</span> para <span className="font-bold text-emerald-400">{finalScores?.overall}</span>.
          </div>
          <button 
            onClick={() => router.push(`/analysis/${analysisId}/preview`)}
            className="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
          >
            Visualizar PDF
          </button>
        </div>
      )}

      {/* Visual Score Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Score Principal */}
        <div className="surface rounded-xl p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex flex-col items-center">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-4">Score Geral ATS</p>
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 border-muted/30">
              <span className={`text-4xl font-bold font-mono ${finalScores ? "text-emerald-400" : scores?.overall && scores.overall < 60 ? "text-amber-500" : "text-indigo-400"}`}>
                {finalScores ? finalScores.overall : scores?.overall || 0}
              </span>
              <span className="text-[12px] text-muted-foreground absolute bottom-4">/100</span>
            </div>
          </div>
          <div className="mt-4">
            {finalScores ? (
              <p className="text-[13px] font-semibold text-emerald-400 flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="h-4 w-4" /> CURRÍCULO OTIMIZADO
              </p>
            ) : (
              <p className="text-[13px] font-semibold text-amber-500 flex items-center gap-1.5 justify-center">
                <AlertCircle className="h-4 w-4" /> RECOMENDA-SE OTIMIZAÇÃO
              </p>
            )}
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
              {finalScores 
                ? "Seu currículo foi reescrito pela IA com novos fatos e métricas de impacto." 
                : "Seu currículo atual tem boa base, mas faltam termos específicos e métricas de impacto."}
            </p>
          </div>
        </div>

        {/* Card 2 & 3: Comparativo de Progresso */}
        <div className="surface rounded-xl p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-[14px] font-semibold">
              {finalScores ? "Evolução Confirmada das Métricas" : "Potencial de Score após Otimização por Vaga"}
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">
              {finalScores ? "Antes vs Depois" : "Score Atual vs Previsão"}
            </span>
          </div>

          <div className="space-y-4">
            {/* Geral */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="font-medium text-muted-foreground">Score Geral</span>
                <span className="font-mono text-[11px] font-semibold">
                  {scores?.overall} % {finalScores ? `→ ${finalScores.overall} %` : "→ 85 % (Previsão)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>Antes</span>
                    <span>{scores?.overall || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${scores?.overall || 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>{finalScores ? "Depois" : "Previsão"}</span>
                    <span>{finalScores ? finalScores.overall : 85}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${finalScores ? "bg-emerald-500" : "bg-indigo-500/40"}`} style={{ width: `${finalScores ? finalScores.overall : 85}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ATS */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="font-medium text-muted-foreground">Compatibilidade ATS</span>
                <span className="font-mono text-[11px] font-semibold">
                  {scores?.ats} % {finalScores ? `→ ${finalScores.ats} %` : "→ 85 % (Previsão)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>Antes</span>
                    <span>{scores?.ats || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${scores?.ats || 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>{finalScores ? "Depois" : "Previsão"}</span>
                    <span>{finalScores ? finalScores.ats : 85}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${finalScores ? "bg-emerald-500" : "bg-indigo-500/40"}`} style={{ width: `${finalScores ? finalScores.ats : 85}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Estrutura */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="font-medium text-muted-foreground">Estrutura e Formatação</span>
                <span className="font-mono text-[11px] font-semibold">
                  {scores?.structure} % {finalScores ? `→ ${finalScores.structure} %` : "→ 90 % (Previsão)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>Antes</span>
                    <span>{scores?.structure || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${scores?.structure || 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>{finalScores ? "Depois" : "Previsão"}</span>
                    <span>{finalScores ? finalScores.structure : 90}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${finalScores ? "bg-emerald-500" : "bg-indigo-500/40"}`} style={{ width: `${finalScores ? finalScores.structure : 90}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Impacto */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="font-medium text-muted-foreground">Métricas de Impacto</span>
                <span className="font-mono text-[11px] font-semibold">
                  {scores?.impact} % {finalScores ? `→ ${finalScores.impact} %` : "→ 80 % (Previsão)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>Antes</span>
                    <span>{scores?.impact || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${scores?.impact || 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                    <span>{finalScores ? "Depois" : "Previsão"}</span>
                    <span>{finalScores ? finalScores.impact : 80}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${finalScores ? "bg-emerald-500" : "bg-indigo-500/40"}`} style={{ width: `${finalScores ? finalScores.impact : 80}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Barra da Esquerda: Score Atual (Original)</span>
            <span>Barra da Direita: {finalScores ? "Score Otimizado" : "Projeção após Respostas"}</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Issues */}
        <div className="lg:col-span-3 space-y-6">
          <div className="surface rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <h2 className="text-[14px] font-semibold">Problemas com ATS</h2>
            </div>
            <p className="text-[12px] text-muted-foreground mb-4">Problemas que podem bloquear a leitura por robôs (ATS).</p>
            <div className="space-y-2">
              {(!analysis?.atsIssues || analysis.atsIssues.length === 0) ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-[13px] text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Nenhum problema grave encontrado.
                </div>
              ) : (
                analysis.atsIssues.map((issue: any, i: number) => (
                  <div key={i} className="rounded-lg bg-secondary p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium">{issue.type}</span>
                      <Badge variant="outline" className={`text-[10px] ${
                        issue.severity === "high" ? "text-red-400 border-red-400/20" :
                        issue.severity === "medium" ? "text-amber-400 border-amber-400/20" :
                        "text-muted-foreground"
                      }`}>{issue.severity}</Badge>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{issue.description}</p>
                    <p className="text-[12px] text-indigo-300">Corrigir: {issue.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {analysis?.sensitiveDataWarnings?.length > 0 && (
            <div className="surface rounded-xl p-5 border-red-500/10">
              <h2 className="text-[14px] font-semibold text-red-400 mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Dados Sensíveis</h2>
              <div className="space-y-2">
                {analysis.sensitiveDataWarnings.map((w: any, i: number) => (
                  <div key={i} className="rounded-lg bg-red-500/5 border border-red-500/10 p-3 text-[12px]">
                    <span className="font-medium text-red-300">{w.type}:</span> <span className="text-red-200/80">{w.recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Strengths/Weaknesses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface rounded-xl p-5">
            <h2 className="text-[14px] font-semibold mb-3">Pontos Fortes</h2>
            <ul className="space-y-2">
              {analysis?.strengths?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-xl p-5">
            <h2 className="text-[14px] font-semibold mb-3">Fraquezas</h2>
            <ul className="space-y-2">
              {analysis?.weaknesses?.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />{w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6 border-t border-border">
        <button
          onClick={() => router.push(`/analysis/${analysisId}/editor`)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-[14px] font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Corrigir e Otimizar Currículo <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
