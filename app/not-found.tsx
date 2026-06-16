import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <FileQuestion className="h-10 w-10 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Página não encontrada
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Não conseguimos encontrar a página que você está procurando. Talvez ela tenha sido movida ou deletada.
        </p>
      </div>
      <Link href="/" className="mt-4">
        <Button variant="default">
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
}
