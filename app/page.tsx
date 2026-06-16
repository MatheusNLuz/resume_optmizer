import Link from "next/link";
import { ArrowRight, FileCheck2, Scale, Zap, Upload, Brain, Download } from "lucide-react";

const modes = [
  {
    href: "/analysis/new?mode=MAKE_ATS_FRIENDLY",
    icon: FileCheck2,
    title: "Otimizar para ATS",
    description: "Analise e reestruture seu currículo para passar nos filtros de ATS. Não precisa de descrição de vaga.",
    cta: "Iniciar Análise",
    accent: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
  {
    href: "/analysis/new?mode=COMPARE_AGAINST_JOB",
    icon: Scale,
    title: "Comparar com a Vaga",
    description: "Cruze seu currículo com uma descrição de vaga e veja o relatório detalhado de lacunas.",
    cta: "Iniciar Comparação",
    accent: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
  {
    href: "/analysis/new?mode=OPTIMIZE_FOR_JOB",
    icon: Zap,
    title: "Otimização Completa",
    description: "Fluxo completo: comparar, responder perguntas da IA, reescrever e exportar o currículo otimizado.",
    cta: "Iniciar Otimização",
    accent: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
];

const steps = [
  { icon: Upload, title: "Upload", desc: "Envie um PDF ou cole o texto do seu currículo." },
  { icon: Brain, title: "Análise", desc: "A IA avalia a estrutura, impacto e compatibilidade com o ATS." },
  { icon: Download, title: "Exportar", desc: "Baixe um PDF limpo e otimizado, pronto para enviar." },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="mb-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Otimização de currículo<br />
          <span className="text-muted-foreground">que realmente funciona.</span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          O ATSForge analisa seu currículo contra regras reais de robôs de ATS, encontra falhas e o reescreve para o máximo de impacto.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid gap-3 sm:grid-cols-3 mb-20">
        {modes.map((mode) => (
          <Link key={mode.href} href={mode.href} className="group">
            <div className="surface surface-hover rounded-xl p-5 transition-all duration-150 hover:shadow-sm h-full flex flex-col">
              <div className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg ${mode.iconBg}`}>
                <mode.icon className={`h-4 w-4 ${mode.accent}`} />
              </div>
              <h3 className="mb-1.5 text-[15px] font-semibold">{mode.title}</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground flex-1">{mode.description}</p>
              <div className={`flex items-center text-[13px] font-medium ${mode.accent}`}>
                {mode.cta}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* How it works */}
      <div className="border-t border-border pt-12">
        <h2 className="mb-8 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Como funciona</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <step.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium">{step.title}</h3>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
