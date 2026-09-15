import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; display_name: string };
export type ClassRoom = { id: string; user_id: string; name: string; subject: string; grade: string; notes: string | null; last_accessed_at: string; created_at: string };
export type Student = { id: string; user_id: string; class_id: string; name: string; notes: string | null; created_at: string };
export type LessonRecord = { id: string; user_id: string; class_id: string; lesson_date: string; content: string; status: "completed" | "partial" | "not_completed"; perception: "good" | "average" | "difficult"; notes: string; pending: string | null; created_at: string };
export type RecordStudent = { lesson_record_id: string; student_id: string; user_id: string };

type SimbiContextValue = {
  profile: Profile | null; classes: ClassRoom[]; students: Student[]; records: LessonRecord[]; links: RecordStudent[];
  loading: boolean; error: string | null; refresh: () => Promise<void>;
  saveClass: (input: Partial<ClassRoom> & Pick<ClassRoom, "name" | "subject" | "grade">) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  saveStudent: (input: Partial<Student> & Pick<Student, "name" | "class_id">) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  saveLesson: (input: Omit<LessonRecord, "id" | "user_id" | "created_at">, studentIds: string[]) => Promise<void>;
  touchClass: (id: string) => Promise<void>;
};

const SimbiContext = createContext<SimbiContextValue | null>(null);

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a ação.";
}

export function SimbiDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<LessonRecord[]>([]);
  const [links, setLinks] = useState<RecordStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw authError ?? new Error("Sessão não encontrada.");
      const user = authData.user;
      const displayName = String(user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Professor");
      const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, display_name: displayName }, { onConflict: "id", ignoreDuplicates: true });
      if (profileError) throw profileError;
      const [profileResult, classResult, studentResult, recordResult, linkResult] = await Promise.all([
        supabase.from("profiles").select("id, display_name").single(),
        supabase.from("classes").select("*").order("last_accessed_at", { ascending: false }),
        supabase.from("students").select("*").order("name"),
        supabase.from("lesson_records").select("*").order("lesson_date", { ascending: false }).order("created_at", { ascending: false }),
        supabase.from("lesson_record_students").select("lesson_record_id, student_id, user_id"),
      ]);
      const firstError = [profileResult.error, classResult.error, studentResult.error, recordResult.error, linkResult.error].find(Boolean);
      if (firstError) throw firstError;
      setProfile(profileResult.data as Profile);
      setClasses((classResult.data ?? []) as ClassRoom[]);
      setStudents((studentResult.data ?? []) as Student[]);
      setRecords((recordResult.data ?? []) as LessonRecord[]);
      setLinks((linkResult.data ?? []) as RecordStudent[]);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const getUserId = async () => {
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) throw authError ?? new Error("Entre novamente para continuar.");
    return data.user.id;
  };

  const value = useMemo<SimbiContextValue>(() => ({
    profile, classes, students, records, links, loading, error, refresh,
    saveClass: async (input) => {
      const userId = await getUserId();
      const payload = { name: input.name.trim(), subject: input.subject.trim(), grade: input.grade.trim(), notes: input.notes?.trim() || null, last_accessed_at: new Date().toISOString(), user_id: userId };
      const result = input.id ? await supabase.from("classes").update(payload).eq("id", input.id) : await supabase.from("classes").insert(payload);
      if (result.error) throw result.error;
      await refresh();
    },
    removeClass: async (id) => { const result = await supabase.from("classes").delete().eq("id", id); if (result.error) throw result.error; await refresh(); },
    saveStudent: async (input) => {
      const userId = await getUserId();
      const payload = { name: input.name.trim(), class_id: input.class_id, notes: input.notes?.trim() || null, user_id: userId };
      const result = input.id ? await supabase.from("students").update(payload).eq("id", input.id) : await supabase.from("students").insert(payload);
      if (result.error) throw result.error;
      await refresh();
    },
    removeStudent: async (id) => { const result = await supabase.from("students").delete().eq("id", id); if (result.error) throw result.error; await refresh(); },
    saveLesson: async (input, studentIds) => {
      const userId = await getUserId();
      const { data, error: insertError } = await supabase.from("lesson_records").insert({ ...input, pending: input.pending?.trim() || null, user_id: userId }).select("id").single();
      if (insertError) throw insertError;
      if (studentIds.length) {
        const result = await supabase.from("lesson_record_students").insert(studentIds.map((studentId) => ({ lesson_record_id: data.id, student_id: studentId, user_id: userId })));
        if (result.error) throw result.error;
      }
      await supabase.from("classes").update({ last_accessed_at: new Date().toISOString() }).eq("id", input.class_id);
      await refresh();
    },
    touchClass: async (id) => { await supabase.from("classes").update({ last_accessed_at: new Date().toISOString() }).eq("id", id); },
  }), [profile, classes, students, records, links, loading, error, refresh]);

  return <SimbiContext.Provider value={value}>{children}</SimbiContext.Provider>;
}

export function useSimbiData() {
  const value = useContext(SimbiContext);
  if (!value) throw new Error("useSimbiData precisa estar dentro de SimbiDataProvider");
  return value;
}

export const statusLabel = { completed: "Concluído", partial: "Parcial", not_completed: "Não concluído" } as const;
export const perceptionLabel = { good: "Boa", average: "Média", difficult: "Difícil" } as const;
export function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`)); }
