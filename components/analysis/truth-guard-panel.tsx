"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TruthGuardPanel({ truthGuardData, onApprove, onEditAnswers }: { truthGuardData: any, onApprove: () => void, onEditAnswers: () => void }) {
  const [approvedClaims, setApprovedClaims] = useState<Record<string, boolean>>({});

  if (!truthGuardData || !truthGuardData.claims) return null;

  const toggleApproval = (index: number) => {
    setApprovedClaims({ ...approvedClaims, [index]: !approvedClaims[index] });
  };

  const hasUnreviewedLowConfidence = truthGuardData.claims.some(
    (c: any, i: number) => c.source === "low_confidence_inference" && approvedClaims[i] === undefined
  );

  return (
    <div className="surface rounded-xl p-6 border-l-4 border-l-orange-500">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-orange-500" />
        <h2 className="text-[16px] font-semibold">Truth Guard: Revisão de Fatos</h2>
      </div>
      
      <p className="text-[13px] text-muted-foreground mb-6">
        A IA identificou algumas informações que não estão explicitamente claras no seu currículo original. 
        Para manter a integridade, você deve aprovar ou rejeitar estas adições antes de reescrevermos o currículo.
      </p>

      <div className="space-y-4 mb-6">
        {truthGuardData.claims.map((claim: any, i: number) => {
          if (claim.source === "confirmed_by_resume" || claim.source === "confirmed_by_user") {
            return (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">{claim.claim}</p>
                  <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">{claim.explanation}</p>
                </div>
              </div>
            );
          }
          
          if (claim.source === "forbidden_to_use" || claim.source === "missing") {
            return (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-red-600 dark:text-red-400 line-through">{claim.claim}</p>
                  <p className="text-[11px] text-red-600/70 dark:text-red-400/70 mt-0.5">{claim.explanation}</p>
                </div>
              </div>
            );
          }

          // Low confidence inference
          const isApproved = approvedClaims[i];
          return (
            <div key={i} className={`flex gap-3 p-4 rounded-lg border transition-colors ${isApproved ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-orange-500/5 border-orange-500/20'}`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isApproved ? 'text-indigo-500' : 'text-orange-500'}`} />
              <div className="flex-1">
                <p className="text-[13px] font-medium mb-1">{claim.claim}</p>
                <p className="text-[11px] text-muted-foreground mb-3">{claim.explanation}</p>
                
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant={isApproved === true ? "default" : "outline"}
                    className={isApproved === true ? "bg-indigo-600" : ""}
                    onClick={() => setApprovedClaims({ ...approvedClaims, [i]: true })}
                  >
                    Aprovar Adição
                  </Button>
                  <Button 
                    size="sm" 
                    variant={isApproved === false ? "destructive" : "outline"}
                    onClick={() => setApprovedClaims({ ...approvedClaims, [i]: false })}
                  >
                    Rejeitar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t border-border mt-6">
        <Button 
          variant="outline"
          onClick={onEditAnswers} 
          className="text-muted-foreground"
        >
          Voltar e Editar Respostas
        </Button>
        <Button 
          onClick={onApprove} 
          disabled={hasUnreviewedLowConfidence}
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {hasUnreviewedLowConfidence ? "Revise as inferências acima" : "Aprovar e Reescrever Currículo"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
