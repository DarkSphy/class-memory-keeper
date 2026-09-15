import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/today" }); },
  head: () => ({ meta: [
    { title: "Simbi — Memória pedagógica" },
    { name: "description", content: "Organize registros de aula, turmas e acompanhamentos de alunos com simplicidade." },
    { property: "og:title", content: "Simbi — Memória pedagógica" },
    { property: "og:description", content: "Uma ferramenta pessoal e simples para a rotina docente." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
