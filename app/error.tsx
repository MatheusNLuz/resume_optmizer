"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Ops, algo deu errado!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ocorreu um erro inesperado ao tentar processar sua solicitação. Por favor, tente novamente.
        </p>
      </div>
      <Button 
        onClick={() => reset()}
        variant="default"
        className="mt-4"
      >
        Tentar Novamente
      </Button>
    </div>
  );
}
