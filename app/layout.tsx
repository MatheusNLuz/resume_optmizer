import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/app-shell/topbar";
import { ToastProvider } from "@/components/ui/custom-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "ATSForge | Construa Currículos Imbatíveis com IA",
  description: "Sistema avançado de Inteligência Artificial focado em otimizar currículos para passar em sistemas ATS. Identifica lacunas, melhora o impacto e gera currículos perfeitos para a sua vaga.",
  keywords: ["currículo", "ats", "inteligência artificial", "vagas", "otimizador de currículo", "resume", "ai"],
  openGraph: {
    title: "ATSForge | Otimizador de Currículos",
    description: "Crie o currículo perfeito com a ajuda de Agentes de IA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATSForge | Otimizador de Currículos",
    description: "Crie o currículo perfeito com a ajuda de Agentes de IA.",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Topbar />
            <main className="flex-1">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
