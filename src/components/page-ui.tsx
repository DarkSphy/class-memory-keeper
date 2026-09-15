import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0">{eyebrow && <p className="mb-1 text-xs font-bold uppercase text-primary">{eyebrow}</p>}<h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}</div>{action}</header>;
}
export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) { return <div className="mb-3 flex items-end justify-between gap-4"><h2 className="font-display text-xl font-bold">{children}</h2>{aside}</div>; }
export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) { return <div className="border-y border-border py-12 text-center"><p className="font-semibold">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>{action && <div className="mt-5">{action}</div>}</div>; }
export function LoadingState() { return <div className="grid min-h-[45vh] place-items-center"><LoaderCircle className="animate-spin text-primary" /><span className="sr-only">Carregando</span></div>; }
export function ErrorState({ message, retry }: { message: string; retry: () => void }) { return <div className="border border-destructive/30 bg-destructive/5 p-5"><div className="flex gap-3"><AlertCircle className="shrink-0 text-destructive" /><div><p className="font-semibold">Algo não saiu como esperado</p><p className="mt-1 text-sm text-muted-foreground">{message}</p><Button variant="outline" size="sm" className="mt-4" onClick={retry}>Tentar novamente</Button></div></div></div>; }
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) { return <label className="grid gap-2 text-sm font-semibold">{label}{children}{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</label>; }
