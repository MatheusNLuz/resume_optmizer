"use client";

import { useState, useEffect } from "react";
import { Save, Key, Settings, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/custom-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [nvidiaKey, setNvidiaKey] = useState("");
  const [showOR, setShowOR] = useState(false);
  const [showNV, setShowNV] = useState(false);

  useEffect(() => {
    setOpenrouterKey(localStorage.getItem("OPENROUTER_API_KEY") || "");
    setNvidiaKey(localStorage.getItem("NVIDIA_NIM_API_KEY") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("OPENROUTER_API_KEY", openrouterKey);
    localStorage.setItem("NVIDIA_NIM_API_KEY", nvidiaKey);
    toast({ title: "Saved", description: "API keys stored locally.", variant: "success" });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">Configure AI providers for your local instance.</p>
      </div>

      <div className="surface rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-[14px] font-semibold">API Keys</h2>
        </div>
        <p className="text-[12px] text-muted-foreground -mt-3">Stored in localStorage. Never sent anywhere except to the API providers.</p>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium">OpenRouter <span className="text-muted-foreground font-normal">(Primary)</span></label>
          <div className="relative">
            <Input type={showOR ? "text" : "password"} placeholder="sk-or-v1-..." value={openrouterKey} onChange={(e) => setOpenrouterKey(e.target.value)} className="pr-9 font-mono text-[12px]" />
            <button onClick={() => setShowOR(!showOR)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showOR ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium">NVIDIA NIM <span className="text-muted-foreground font-normal">(Secondary)</span></label>
          <div className="relative">
            <Input type={showNV ? "text" : "password"} placeholder="nvapi-..." value={nvidiaKey} onChange={(e) => setNvidiaKey(e.target.value)} className="pr-9 font-mono text-[12px]" />
            <button onClick={() => setShowNV(!showNV)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showNV ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-500">
            <Save className="h-3.5 w-3.5" /> Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}
