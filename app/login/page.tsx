"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/custom-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao realizar login");

      toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso.", variant: "success" });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast({ title: "Falha no Login", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight font-heading">
            Entrar no ATSForge
          </h2>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Otimização inteligente de currículos e perfis do LinkedIn.
          </p>
        </div>

        <div className="surface rounded-2xl border border-border/80 p-8 shadow-2xl backdrop-blur-md bg-secondary/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[12.5px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full h-10 px-3.5 rounded-lg border border-border bg-background text-[13px] transition-all focus:border-indigo-500 focus:outline-none"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[12.5px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Senha
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full h-10 px-3.5 rounded-lg border border-border bg-background text-[13px] transition-all focus:border-indigo-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[13.5px] font-semibold text-white hover:bg-indigo-500 transition-all disabled:opacity-55 disabled:cursor-not-allowed shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Conectando...</>
              ) : (
                <><span className="flex-1 text-center pl-4">Entrar</span> <ArrowRight className="h-4 w-4 shrink-0" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-border/60 pt-4">
            <p className="text-[12.5px] text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
