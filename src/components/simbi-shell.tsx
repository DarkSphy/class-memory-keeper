import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Home, LogOut, MessageCircle, Plus, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SimbiDataProvider, useSimbiData } from "@/lib/simbi-data";

const navigation = [
  { to: "/today", label: "Hoje", icon: Home },
  { to: "/classes", label: "Turmas", icon: BookOpen },
  { to: "/students", label: "Alunos", icon: Users },
  { to: "/simbi", label: "Simbi", icon: MessageCircle },
] as const;

function ShellContent() {
  const { profile, classes } = useSimbiData();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const registerTo = classes[0] ? `/classes/${classes[0].id}/record` : "/classes";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-sidebar lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
        <div className="flex h-20 items-center gap-3 px-7"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><GraduationCap size={19} /></span><span className="font-display text-2xl font-bold">Simbi</span></div>
        <nav className="mt-4 grid gap-1 px-4">{navigation.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground" activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}><Icon size={19} />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-sidebar-border p-4"><p className="truncate px-3 text-sm font-semibold">{profile?.display_name ?? "Professor"}</p><Button variant="ghost" className="mt-1 w-full justify-start text-muted-foreground" onClick={signOut}><LogOut />Sair</Button></div>
      </aside>
      <main className="min-w-0 pb-24 lg:pb-8">
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border bg-background/95 px-5 backdrop-blur-sm lg:hidden"><Link to="/today" className="flex min-w-0 items-center gap-2 font-display text-xl font-bold"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"><GraduationCap size={17} /></span>Simbi</Link><Button asChild size="icon" aria-label="Registrar aula"><Link to={registerTo}><Plus /></Link></Button></header>
        <div className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10"><Outlet /></div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[76px] grid-cols-4 border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">{navigation.map(({ to, label, icon: Icon }) => { const active = path === to || (to !== "/today" && path.startsWith(to)); return <Link key={to} to={to} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}><Icon size={20} strokeWidth={active ? 2.4 : 1.8} />{label}</Link>; })}</nav>
    </div>
  );
}

export function SimbiShell() { return <SimbiDataProvider><ShellContent /></SimbiDataProvider>; }
