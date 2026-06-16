import Link from "next/link";
import { FileText, Plus, History, Settings } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <FileText className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-heading text-[15px] font-semibold tracking-tight">ATSForge</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/history" className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <History className="h-3.5 w-3.5" /> Histórico
          </Link>
          <Link href="/settings" className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings className="h-3.5 w-3.5" /> Configurações
          </Link>
          <div className="ml-2 h-4 w-px bg-border" />
          <Link href="/" className="ml-2 flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-indigo-500">
            <Plus className="h-3.5 w-3.5" /> Novo
          </Link>
        </div>
      </div>
    </header>
  );
}
