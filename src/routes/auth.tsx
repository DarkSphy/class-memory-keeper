import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/page-ui";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — Simbi" },
    { name: "description", content: "Entre ou crie sua conta na Simbi." },
    { property: "og:title", content: "Entrar — Simbi" },
    { property: "og:description", content: "Acesse sua memória pedagógica pessoal." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [isError, setIsError] = useState(false);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => { if (data.user) void navigate({ to: "/today", replace: true }); }); }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setIsError(false);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error; setMessage("Enviamos um link para redefinir sua senha."); return;
      }
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } } });
        if (error) throw error;
        if (!data.session) { setMessage("Conta criada. Confira seu e-mail para confirmar o acesso."); return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
      }
      await navigate({ to: "/today", replace: true });
    } catch (error) { setIsError(true); setMessage(error instanceof Error ? error.message : "Não foi possível continuar."); }
    finally { setBusy(false); }
  }

  async function google() {
    setBusy(true); setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setIsError(true); setMessage(result.error.message); setBusy(false); return; }
    if (!result.redirected) await navigate({ to: "/today", replace: true });
  }

  return <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_1.05fr]">
    <section className="hidden bg-primary p-14 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><div className="flex items-center gap-3 font-display text-2xl font-bold"><span className="grid size-10 place-items-center rounded-md bg-primary-foreground text-primary"><GraduationCap /></span>Simbi</div><div className="max-w-lg"><p className="font-display text-5xl font-bold leading-[1.08]">Sua memória pedagógica, sempre por perto.</p><p className="mt-6 max-w-md text-lg leading-8 text-primary-foreground/75">Registre o essencial de cada aula e retome sua rotina com clareza.</p></div><p className="text-sm text-primary-foreground/60">Uma ferramenta pessoal para professores.</p></section>
    <section className="flex min-h-screen items-center justify-center px-6 py-12"><div className="w-full max-w-sm"><div className="mb-10 flex items-center gap-3 font-display text-2xl font-bold lg:hidden"><span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><GraduationCap /></span>Simbi</div><p className="text-sm font-bold text-primary">{mode === "signup" ? "Comece por aqui" : mode === "forgot" ? "Recupere seu acesso" : "Bem-vindo de volta"}</p><h1 className="mt-2 font-display text-4xl font-bold">{mode === "signup" ? "Criar conta" : mode === "forgot" ? "Redefinir senha" : "Entrar na Simbi"}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{mode === "forgot" ? "Informe seu e-mail para receber o link de recuperação." : "Sua rotina docente organizada com leveza."}</p>
      <form onSubmit={submit} className="mt-8 grid gap-5">{mode === "signup" && <Field label="Seu nome"><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado?" autoComplete="name" /></Field>}<Field label="E-mail"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" /></Field>{mode !== "forgot" && <Field label="Senha"><Input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete={mode === "signup" ? "new-password" : "current-password"} /></Field>}{message && <p role="status" className={`text-sm ${isError ? "text-destructive" : "text-primary"}`}>{message}</p>}<Button size="lg" disabled={busy}>{busy ? "Aguarde..." : mode === "signup" ? "Criar minha conta" : mode === "forgot" ? "Enviar link" : "Entrar"}</Button></form>
      {mode !== "forgot" && <><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div><Button type="button" variant="outline" size="lg" className="w-full" onClick={google} disabled={busy}><span className="font-bold">G</span>Continuar com Google</Button></>}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"><Button variant="link" className="px-0" onClick={() => { setMessage(""); setMode(mode === "signup" ? "login" : "signup"); }}>{mode === "signup" ? "Já tenho conta" : "Criar uma conta"}</Button>{mode === "login" && <Button variant="link" className="px-0 text-muted-foreground" onClick={() => { setMessage(""); setMode("forgot"); }}>Esqueci minha senha</Button>}{mode === "forgot" && <Button variant="link" className="px-0" onClick={() => { setMessage(""); setMode("login"); }}>Voltar para entrar</Button>}</div>
    </div></section>
  </main>;
}
