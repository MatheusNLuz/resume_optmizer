"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2, ChevronRight, Download, FileText, Briefcase, HelpCircle, PenTool, Layout } from "lucide-react";
import { useToast } from "@/components/ui/custom-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { StructuredResumeEditor } from "@/components/editor/structured-resume-editor";
import { TruthGuardPanel } from "@/components/analysis/truth-guard-panel";

export function EditorClient({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("match");

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [truthGuardData, setTruthGuardData] = useState<any>(null);
  const [runningTruthGuard, setRunningTruthGuard] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const generatingRef = useRef(false);

  useEffect(() => {
    fetchData();
  }, [analysisId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/analysis/${analysisId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const d = await res.json();
      setData(d);
      
      if (d.mode === "LINKEDIN_OPTIMIZATION") {
        setActiveTab("questions");
      } else if (!d.comparisonJson && d.jobDescription) {
        // Needs match
      } else if (!d.questions || d.questions.length === 0) {
        // Generate questions if not exist
        if (!generatingRef.current) {
          generatingRef.current = true;
          fetchQuestions();
        }
      } else {
        setQuestions(d.questions);
        // Load existing answers into state
        const initialAnswers: Record<string, string> = {};
        d.questions.forEach((q: any) => {
          if (q.answer) initialAnswers[q.id] = q.answer;
          else if (q.suggestedAnswer) initialAnswers[q.id] = q.suggestedAnswer;
        });
        setAnswers(initialAnswers);
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not load data", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      const res = await fetch(`/api/smart-questions`, {
        method: "POST", body: JSON.stringify({ analysisId })
      });
      const d = await res.json();
      if (d.success) {
        setQuestions(d.questions);
        const initialAnswers: Record<string, string> = {};
        d.questions.forEach((q: any) => {
          if (q.answer) initialAnswers[q.id] = q.answer;
        });
        setAnswers(initialAnswers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingQuestions(false);
    }
  };

// Translate the editor UI
  const handleTruthGuard = async () => {
    setRunningTruthGuard(true);
    try {
      // First save typed answers
      await fetch(`/api/smart-questions/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, answers })
      });

      const res = await fetch(`/api/truth-guard`, {
        method: "POST", body: JSON.stringify({ analysisId })
      });
      const d = await res.json();
      if (d.success) {
        setTruthGuardData(d.truthGuard);
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha no Truth Guard", variant: "error" });
    } finally {
      setRunningTruthGuard(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      // First save typed answers
      await fetch(`/api/smart-questions/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, answers })
      });

      const res = await fetch(`/api/optimize`, {
        method: "POST", body: JSON.stringify({ analysisId })
      });
      const d = await res.json();
      if (d.success) {
        if (data.mode === "LINKEDIN_OPTIMIZATION") {
          toast({ title: "Sucesso", description: "Perfil do LinkedIn otimizado com sucesso!", variant: "success" });
          router.push(`/analysis/${analysisId}`);
        } else {
          toast({ title: "Sucesso", description: "Currículo otimizado!", variant: "success" });
          fetchData();
          setActiveTab("preview");
        }
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao otimizar", variant: "error" });
    } finally {
      setOptimizing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/export`, {
        method: "POST", body: JSON.stringify({ analysisId })
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_${analysisId}.pdf`;
      a.click();
      toast({ title: "Exportado", description: "Seu PDF está pronto.", variant: "success" });
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao exportar PDF", variant: "error" });
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setGeneratingLetter(true);
    try {
      const res = await fetch(`/api/cover-letter`, {
        method: "POST", body: JSON.stringify({ analysisId })
      });
      const d = await res.json();
      if (d.success) {
        fetchData();
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao gerar carta de apresentação", variant: "error" });
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleSaveManualEdit = async (newData: any) => {
    try {
      const res = await fetch(`/api/analysis/${analysisId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalResumeJson: JSON.stringify(newData) }),
      });
      if (res.ok) {
        fetchData();
      } else {
        toast({ title: "Erro", description: "Falha ao salvar", variant: "error" });
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao salvar", variant: "error" });
    }
  };

  if (loading || !data) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const match = data.comparisonJson ? JSON.parse(data.comparisonJson) : null;
  const optimized = data.finalResumeJson ? JSON.parse(data.finalResumeJson) : null;

  const isLinkedIn = data.mode === "LINKEDIN_OPTIMIZATION";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => router.push(`/analysis/${analysisId}`)}
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors cursor-pointer"
        >
          ← Voltar para o Painel de Resultados
        </button>
        <h1 className="font-heading text-2xl font-semibold">
          {isLinkedIn ? "Otimizar Perfil do LinkedIn" : "Editor de Currículo e Otimização"}
        </h1>
        <p className="text-[13px] text-muted-foreground">
          {isLinkedIn 
            ? "Responda a perguntas estratégicas para gerar dados e métricas reais de performance."
            : "Responda perguntas, reescreva e exporte o currículo."}
        </p>
      </div>

      {isLinkedIn ? (
        <div className="space-y-6 animate-fade-in">
          <div className="surface rounded-xl p-6">
            <h2 className="text-[16px] font-semibold mb-4">Perguntas Estratégicas (Smart Questions)</h2>
            <p className="text-[13px] text-muted-foreground mb-6">
              Responda a estas perguntas sobre suas experiências para que a IA possa gerar descrições e resumos com métricas e dados reais, sem inventar informações.
            </p>
            {generatingQuestions ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-secondary/30 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <div className="text-[14px] font-medium text-indigo-400 animate-pulse text-center">
                  A IA está analisando seu perfil e gerando perguntas estratégicas...
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-[13px] text-muted-foreground">Nenhuma pergunta gerada.</div>
            ) : (
              <div className="space-y-6">
                {questions.map((q: any, i: number) => (
                  <div key={q.id} className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-[14px] font-semibold mb-2">{i + 1}. {q.question}</p>
                    <p className="text-[12px] text-blue-400 mb-3 font-medium">Motivo: {q.reason}</p>
                    {q.suggestedAnswer && (
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.id]: q.suggestedAnswer })}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 mb-2 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Usar Sugestão da IA
                      </button>
                    )}
                    <Textarea 
                      className="text-[13px] bg-background" 
                      placeholder="Sua resposta..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              {!truthGuardData ? (
                <button onClick={handleTruthGuard} disabled={runningTruthGuard} className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-500 shadow-sm cursor-pointer">
                  {runningTruthGuard ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Verificando Integridade...</> : <>Validar Fatos & Otimizar Perfil <ArrowRight className="ml-2 h-3.5 w-3.5" /></>}
                </button>
              ) : (
                <TruthGuardPanel 
                  truthGuardData={truthGuardData} 
                  onApprove={handleOptimize} 
                  onEditAnswers={() => setTruthGuardData(null)}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-secondary flex overflow-x-auto">
          {match && <TabsTrigger value="match" className="text-[13px]"><Briefcase className="mr-2 h-3.5 w-3.5" /> Compatibilidade com a Vaga</TabsTrigger>}
          <TabsTrigger value="questions" className="text-[13px]"><HelpCircle className="mr-2 h-3.5 w-3.5" /> Smart Questions</TabsTrigger>
          {optimized && <TabsTrigger value="edit" className="text-[13px]"><PenTool className="mr-2 h-3.5 w-3.5" /> Editar Estrutura</TabsTrigger>}
          <TabsTrigger value="preview" className="text-[13px]"><Layout className="mr-2 h-3.5 w-3.5" /> Preview & Exportar</TabsTrigger>
          <TabsTrigger value="coverletter" className="text-[13px]"><FileText className="mr-2 h-3.5 w-3.5" /> Carta de Apresentação</TabsTrigger>
        </TabsList>

        {match && (
          <TabsContent value="match" className="space-y-6">
            <div className="surface rounded-xl p-6">
              <h2 className="text-[16px] font-semibold mb-4">Análise de Compatibilidade</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-indigo-400">{match.matchPercentage}%</div>
                <div className="text-[13px] text-muted-foreground">Nota de compatibilidade com a vaga fornecida.</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-[13px] font-medium mb-2">Habilidades Obrigatórias Ausentes</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[12px] text-muted-foreground">
                    {match.missingMandatorySkills.map((s: string) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-[13px] font-medium mb-2">Lacunas de Experiência</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[12px] text-muted-foreground">
                    {match.experienceGaps.map((s: string) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
              <button onClick={() => setActiveTab("questions")} className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-[13px] text-white hover:bg-indigo-500">
                Continuar para as Perguntas <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </button>
            </div>
          </TabsContent>
        )}

        <TabsContent value="questions" className="space-y-6">
          <div className="surface rounded-xl p-6">
            <h2 className="text-[16px] font-semibold mb-4">Smart Questions</h2>
            <p className="text-[13px] text-muted-foreground mb-6">Responda estas perguntas para ajudar a IA a gerar o currículo perfeito e sem lacunas.</p>
            {generatingQuestions ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-secondary/30 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <div className="text-[14px] font-medium text-indigo-400 animate-pulse text-center">
                  A IA está analisando seu currículo e formulando perguntas estratégicas...
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-[13px] text-muted-foreground">Nenhuma pergunta gerada.</div>
            ) : (
              <div className="space-y-6">
                {questions.map((q: any, i: number) => (
                  <div key={q.id} className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-[14px] font-medium mb-2">{i + 1}. {q.question}</p>
                    <p className="text-[12px] text-indigo-300 mb-3">Motivo: {q.reason}</p>
                    {q.suggestedAnswer && (
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.id]: q.suggestedAnswer })}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 mb-2 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Usar Sugestão da IA
                      </button>
                    )}
                    <Textarea 
                      className="text-[13px] bg-background" 
                      placeholder="Sua resposta..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              {!truthGuardData ? (
                <button onClick={handleTruthGuard} disabled={runningTruthGuard} className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-[13px] text-white hover:bg-orange-500">
                  {runningTruthGuard ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Verificando Integridade...</> : <>Validar Fatos (Truth Guard) <ArrowRight className="ml-2 h-3.5 w-3.5" /></>}
                </button>
              ) : (
                <TruthGuardPanel 
                  truthGuardData={truthGuardData} 
                  onApprove={handleOptimize} 
                  onEditAnswers={() => setTruthGuardData(null)}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {optimized && (
          <TabsContent value="edit" className="space-y-6">
            <StructuredResumeEditor initialData={optimized} onSave={handleSaveManualEdit} />
          </TabsContent>
        )}

        <TabsContent value="preview" className="space-y-6">
          <div className="surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold">Preview do Currículo</h2>
              {optimized && (
                <div className="flex items-center gap-4">
                  <select 
                    className="h-9 px-3 rounded-lg text-[13px] bg-secondary border border-border"
                    value={data.selectedTemplate || "basic-ats"}
                    onChange={async (e) => {
                      const val = e.target.value;
                      setData({ ...data, selectedTemplate: val });
                      await fetch(`/api/analysis/${analysisId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ selectedTemplate: val }),
                      });
                    }}
                  >
                    <option value="basic-ats">Basic ATS Template</option>
                    <option value="modern-ats">Modern ATS Template</option>
                  </select>
                  <button onClick={handleExport} disabled={exporting} className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-[13px] text-white hover:bg-emerald-500">
                    {exporting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-2 h-3.5 w-3.5" />} Baixar PDF
                  </button>
                </div>
              )}
            </div>
            
            {!optimized ? (
              <div className="text-[13px] text-muted-foreground text-center py-12">O currículo ainda não foi otimizado. Volte e clique em Reescrever Currículo.</div>
            ) : (
              <div className="bg-white text-black p-8 rounded-lg shadow-sm min-h-[800px] border">
                <iframe src={`/analysis/${analysisId}/preview`} className="w-full h-[800px] border-0" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="coverletter" className="space-y-6">
          <div className="surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold">Carta de Apresentação</h2>
              {optimized && (
                <button onClick={handleGenerateCoverLetter} disabled={generatingLetter} className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-[13px] text-white hover:bg-indigo-500">
                  {generatingLetter ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <PenTool className="mr-2 h-3.5 w-3.5" />} {data.coverLetter ? "Regerar Carta" : "Gerar Carta"}
                </button>
              )}
            </div>
            
            {!data.coverLetter ? (
              <div className="text-[13px] text-muted-foreground text-center py-12">
                {!optimized ? "Otimize o seu currículo primeiro." : "Clique em gerar para escrever uma carta de apresentação baseada na vaga."}
              </div>
            ) : (
              <div className="bg-background border border-border p-6 rounded-lg text-[13px] whitespace-pre-wrap leading-relaxed">
                {data.coverLetter}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
