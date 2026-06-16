# Currículo Expert / ATS Optimizer

Um sistema inteligente construído com Next.js (App Router) e Inteligência Artificial para analisar currículos em PDF, comparar com descrições de vagas, identificar gaps técnicos e gerar "Smart Questions" com foco no método STAR (quantitativo). 
Após as respostas do usuário, o sistema reescreve o currículo aplicando as melhores práticas de ATS (Applicant Tracking System), maximizando as chances de aprovação.

## Funcionalidades
- Parse automático de currículos em PDF (extração de texto avançada).
- Comparação profunda do currículo atual com a vaga desejada usando IA (LLM via OpenRouter).
- Geração de "Smart Questions" forçando métricas numéricas e dados quantitativos.
- Editor interativo para revisar e alterar os dados antes da reescrita final.
- Geração final do PDF em padrão visual aprovado por ATS (como o formato canadense/americano).

## Tecnologias Utilizadas
- **Next.js 14+** (App Router)
- **React 19**
- **TailwindCSS v4** + **shadcn/ui**
- **Prisma ORM** com banco de dados **SQLite** local (dev.db)
- **OpenRouter** para integração com modelos de LLM (ex: Claude 3.5 Sonnet, Llama 3)
- **@napi-rs/canvas** e **pdf-parse** para extração de dados do PDF

## Como rodar o projeto localmente

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` na raiz do projeto com as chaves necessárias (OpenRouter API, Database URL, etc):
```env
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY="sk-or-v1-..."
# Outras chaves se necessário (NVIDIA_API_KEY, etc)
```

3. Prepare o banco de dados local com Prisma:
```bash
npx prisma generate
npx prisma db push
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.
