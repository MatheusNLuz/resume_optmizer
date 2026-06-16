import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20"></div>
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white animate-pulse">
        Carregando...
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Preparando o ambiente para você.
      </p>
    </div>
  );
}
