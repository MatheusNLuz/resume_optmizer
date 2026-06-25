"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, FileText, ArrowRight, ClipboardType, Loader2, CheckCircle2, X, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/custom-toast";

const MODE_LABELS: Record<string, string> = {
  MAKE_ATS_FRIENDLY: "Otimização para ATS",
  COMPARE_AGAINST_JOB: "Comparação com a Vaga",
  OPTIMIZE_FOR_JOB: "Otimização Completa",
  LINKEDIN_OPTIMIZATION: "Otimização de LinkedIn",
};

const JOB_LOCATIONS = [
  { value: "BR", label: "🇧🇷 Brasil", lang: "pt-BR", format: "Padrão brasileiro (PT-BR)" },
  { value: "US", label: "🇺🇸 Estados Unidos", lang: "en-US", format: "American resume format (EN-US)" },
  { value: "UK", label: "🇬🇧 Reino Unido", lang: "en-US", format: "British CV format (EN-UK)" },
  { value: "CA", label: "🇨🇦 Canadá", lang: "en-US", format: "Canadian resume format (EN-US)" },
  { value: "DE", label: "🇩🇪 Alemanha", lang: "en-US", format: "German Lebenslauf style (EN)" },
  { value: "PT", label: "🇵🇹 Portugal", lang: "pt-BR", format: "Padrão europeu (PT-PT)" },
  { value: "REMOTE", label: "🌍 Remoto (Internacional)", lang: "en-US", format: "International remote format (EN-US)" },
];

function NewAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const mode = searchParams.get("mode") || "MAKE_ATS_FRIENDLY";
  const requiresJob = mode === "COMPARE_AGAINST_JOB" || mode === "OPTIMIZE_FOR_JOB";

  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pdf");
  const [dragActive, setDragActive] = useState(false);

  const selectedLocation = JOB_LOCATIONS.find(l => l.value === jobLocation);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.type !== "application/pdf") {
        toast({ title: "Arquivo inválido", description: "Por favor, envie um PDF.", variant: "warning" });
        return;
      }
      setFile(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const selectedLang = selectedLocation?.lang || "pt-BR";
      
      const analysisRes = await fetch("/api/analysis/create", {
        method: "POST",
        body: JSON.stringify({ mode, jobLocation, selectedLanguage: selectedLang }),
        headers: { "Content-Type": "application/json" },
      });
      if (!analysisRes.ok) {
        let errStr = "Falha ao criar análise.";
        try {
           const err = await analysisRes.json();
           if(err.error) errStr = err.error;
        } catch(e) {}
        throw new Error(errStr);
      }
      const analysisData = await analysisRes.json();

      if (activeTab === "pdf" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("analysisId", analysisData.id);

        const uploadRes = await fetch("/api/upload-resume", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Falha ao fazer upload e extração do currículo.");
        const uploadData = await uploadRes.json();
        if (!uploadData?.file?.id) throw new Error("Upload falhou.");
      } else if (activeTab === "paste" && pastedText.trim()) {
        await fetch(`/api/analysis/${analysisData.id}`, {
          method: "PATCH",
          body: JSON.stringify({ originalResumeText: pastedText, parsedResumeText: pastedText }),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (requiresJob && jobDescription.trim()) {
        await fetch(`/api/analysis/${analysisData.id}`, {
          method: "PATCH",
          body: JSON.stringify({ jobDescription }),
          headers: { "Content-Type": "application/json" },
        });
      }

      router.push(`/analysis/${analysisData.id}`);
    } catch (error: any) {
      console.error(error);
      toast({ title: "Erro", description: error.message || "Algo deu errado.", variant: "error", duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const isValid = () => {
    if (activeTab === "pdf" && !file) return false;
    if (activeTab === "paste" && pastedText.trim().length < 50) return false;
    if (requiresJob && jobDescription.trim().length < 50) return false;
    if (requiresJob && !jobLocation) return false;
    return true;
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="mb-1 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">{MODE_LABELS[mode]}</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {mode === "LINKEDIN_OPTIMIZATION" ? "Envie seu perfil do LinkedIn" : "Envie seu currículo"}
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {mode === "LINKEDIN_OPTIMIZATION" 
            ? "Vamos extrair as informações do perfil e analisar o SEO/atratividade para recrutadores."
            : "Vamos extrair o conteúdo e rodar a análise de IA."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Resume Input */}
        <div className="surface rounded-xl p-5">
          <h2 className="mb-4 text-[14px] font-semibold">
            {mode === "LINKEDIN_OPTIMIZATION" ? "Perfil do LinkedIn" : "Currículo"}
          </h2>
          <Tabs defaultValue="pdf" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="pdf" className="text-[13px] data-[state=active]:bg-background"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload de PDF</TabsTrigger>
              <TabsTrigger value="paste" className="text-[13px] data-[state=active]:bg-background"><ClipboardType className="mr-1.5 h-3.5 w-3.5" /> Colar Texto</TabsTrigger>
            </TabsList>

            <TabsContent value="pdf">
              <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                  dragActive ? "border-indigo-500 bg-indigo-500/5" : file ? "border-emerald-500/40 bg-emerald-500/5" : "border-border hover:border-muted-foreground/30"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div className="text-left">
                      <p className="text-[13px] font-medium">{file.name}</p>
                      <p className="text-[12px] text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-3 h-6 w-6 text-muted-foreground" />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="text-[13px] font-medium text-indigo-400 hover:underline">Procurar arquivos</span>
                      <span className="text-[13px] text-muted-foreground"> ou arraste e solte</span>
                      <input id="resume-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </label>
                    <p className="mt-1 text-[11px] text-muted-foreground">PDF, max 10MB</p>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste">
              <Textarea
                placeholder={mode === "LINKEDIN_OPTIMIZATION" 
                  ? "Cole o texto do seu perfil do LinkedIn (Título, Sobre, Experiências)..." 
                  : "Cole o texto completo do seu currículo..."}
                className="min-h-[250px] resize-none bg-background text-[13px]"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
              {pastedText.length > 0 && pastedText.length < 50 && (
                <p className="mt-1 text-[11px] text-amber-400">Mínimo de 50 caracteres</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Job Description */}
        {requiresJob && (
          <div className="surface rounded-xl p-5">
            <h2 className="mb-4 text-[14px] font-semibold">Descrição da Vaga</h2>
            <Textarea
              placeholder="Cole a descrição da vaga aqui..."
              className="min-h-[180px] resize-none bg-background text-[13px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            {jobDescription.length > 0 && jobDescription.length < 50 && (
              <p className="mt-1 text-[11px] text-amber-400">Mínimo de 50 caracteres</p>
            )}
          </div>
        )}

        {/* Job Location */}
        {requiresJob && (
          <div className="surface rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <h2 className="text-[14px] font-semibold">Onde é a vaga?</h2>
            </div>
            <p className="mb-4 text-[13px] text-muted-foreground">
              Selecione o país/região da vaga. Isso define o idioma, o formato do currículo e as convenções locais.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {JOB_LOCATIONS.map((loc) => (
                <button
                  key={loc.value}
                  onClick={() => setJobLocation(loc.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left transition-all text-[13px] ${
                    jobLocation === loc.value
                      ? "border-indigo-500 bg-indigo-500/10 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                  }`}
                >
                  <div className="font-medium">{loc.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{loc.format}</div>
                </button>
              ))}
            </div>
            {!jobLocation && (
              <p className="mt-3 text-[11px] text-amber-400">Selecione a localização da vaga para continuar</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!isValid() || loading}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Processando...</> : <>Continuar <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewAnalysisPage() {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <NewAnalysisContent />
    </Suspense>
  );
}
