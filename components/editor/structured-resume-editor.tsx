"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/custom-toast";

export function StructuredResumeEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);

  const handleContactChange = (field: string, value: string) => {
    setData({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleSummaryChange = (value: string) => {
    setData({ ...data, professionalSummary: value });
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const newExp = [...(data.experiences || [])];
    newExp[index][field] = value;
    setData({ ...data, experiences: newExp });
  };

  const handleSave = () => {
    onSave(data);
    toast({ title: "Salvo", description: "Alterações salvas com sucesso.", variant: "success" });
  };

  if (!data) return null;

  return (
    <div className="space-y-8 bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Editar Estrutura</h2>
          <p className="text-[13px] text-muted-foreground">Modifique os campos livremente. Eles serão atualizados no PDF final.</p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[14px] font-semibold border-b border-border pb-2">Contato</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Nome Completo</label>
            <Input value={data.personalInfo?.name || ""} onChange={(e) => handleContactChange("name", e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Email</label>
            <Input value={data.personalInfo?.email || ""} onChange={(e) => handleContactChange("email", e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Telefone</label>
            <Input value={data.personalInfo?.phone || ""} onChange={(e) => handleContactChange("phone", e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Localização</label>
            <Input value={data.personalInfo?.location || ""} onChange={(e) => handleContactChange("location", e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">LinkedIn</label>
            <Input value={data.personalInfo?.linkedin || ""} onChange={(e) => handleContactChange("linkedin", e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Portfólio</label>
            <Input value={data.personalInfo?.portfolio || ""} onChange={(e) => handleContactChange("portfolio", e.target.value)} className="h-8 text-[13px]" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[14px] font-semibold border-b border-border pb-2">Resumo Profissional</h3>
        <Textarea 
          value={data.professionalSummary || ""} 
          onChange={(e) => handleSummaryChange(e.target.value)}
          className="min-h-[100px] text-[13px]"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-[14px] font-semibold border-b border-border pb-2">Experiência Profissional</h3>
        <div className="space-y-6">
          {(data.experiences || []).map((exp: any, i: number) => (
            <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border space-y-4 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-muted-foreground">Empresa</label>
                  <Input value={exp.company || ""} onChange={(e) => handleExperienceChange(i, "company", e.target.value)} className="h-8 text-[13px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-muted-foreground">Cargo</label>
                  <Input value={exp.title || ""} onChange={(e) => handleExperienceChange(i, "title", e.target.value)} className="h-8 text-[13px]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">Descrição</label>
                <Textarea 
                  value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || "")} 
                  onChange={(e) => handleExperienceChange(i, "description", e.target.value.split('\n').filter(Boolean))} 
                  className="h-20 text-[13px]" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
