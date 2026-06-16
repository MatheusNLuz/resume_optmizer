import Link from "next/link";
import { Clock, ArrowRight, FileText, Plus, Scale, Zap, FileCheck2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const MODE_ICONS: Record<string, any> = {
  MAKE_ATS_FRIENDLY: FileCheck2,
  COMPARE_AGAINST_JOB: Scale,
  OPTIMIZE_FOR_JOB: Zap,
};

export default async function HistoryPage() {
  const history = await prisma.analysis.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      mode: true,
      professionalTarget: true,
      selectedLanguage: true,
      createdAt: true,
      initialScores: true,
      finalScores: true,
    },
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">History</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">Your past resume optimizations.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-500">
          <Plus className="h-3.5 w-3.5" /> New
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="surface rounded-xl p-12 text-center">
          <Clock className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
          <h3 className="text-[15px] font-semibold mb-1">No history yet</h3>
          <p className="text-[13px] text-muted-foreground mb-5">You haven't run any resume analyses.</p>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary/80">
            Start Analysis
          </Link>
        </div>
      ) : (
        <div className="grid gap-2">
          {history.map((item: any) => {
            let initialScore = 0;
            let finalScore = 0;
            try {
              if (item.initialScores) initialScore = JSON.parse(item.initialScores).overall || 0;
              if (item.finalScores) finalScore = JSON.parse(item.finalScores).overall || 0;
            } catch (e) {}

            const ModeIcon = MODE_ICONS[item.mode] || FileText;

            return (
              <Link key={item.id} href={`/analysis/${item.id}`} className="group block">
                <div className="surface surface-hover rounded-xl p-4 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <ModeIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14px] font-semibold">{item.professionalTarget || "General Resume"}</h3>
                        <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">{item.mode.replace(/_/g, " ")}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="uppercase">{item.selectedLanguage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {(initialScore > 0 || finalScore > 0) && (
                      <div className="flex items-center gap-4">
                        {initialScore > 0 && (
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Initial</div>
                            <div className="text-[14px] font-semibold">{initialScore}</div>
                          </div>
                        )}
                        {finalScore > 0 && (
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-emerald-500/60">Final</div>
                            <div className="text-[14px] font-semibold text-emerald-400">{finalScore}</div>
                          </div>
                        )}
                      </div>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
