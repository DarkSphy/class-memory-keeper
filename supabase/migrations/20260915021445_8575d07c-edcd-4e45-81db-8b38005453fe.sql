CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 60),
  subject text NOT NULL CHECK (char_length(trim(subject)) BETWEEN 1 AND 80),
  grade text NOT NULL CHECK (char_length(trim(grade)) BETWEEN 1 AND 40),
  notes text,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes_select_own" ON public.classes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "classes_insert_own" ON public.classes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "classes_update_own" ON public.classes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "classes_delete_own" ON public.classes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX classes_user_recent_idx ON public.classes (user_id, last_accessed_at DESC);
CREATE TRIGGER classes_set_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 100),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_select_own" ON public.students FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "students_insert_own" ON public.students FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()));
CREATE POLICY "students_update_own" ON public.students FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()));
CREATE POLICY "students_delete_own" ON public.students FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX students_user_class_idx ON public.students (user_id, class_id, name);
CREATE TRIGGER students_set_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.lesson_status AS ENUM ('completed', 'partial', 'not_completed');
CREATE TYPE public.class_perception AS ENUM ('good', 'average', 'difficult');

CREATE TABLE public.lesson_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  lesson_date date NOT NULL DEFAULT current_date,
  content text NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 240),
  status public.lesson_status NOT NULL,
  perception public.class_perception NOT NULL,
  notes text NOT NULL CHECK (char_length(trim(notes)) BETWEEN 1 AND 4000),
  pending text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_records TO authenticated;
GRANT ALL ON public.lesson_records TO service_role;
ALTER TABLE public.lesson_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_records_select_own" ON public.lesson_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lesson_records_insert_own" ON public.lesson_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()));
CREATE POLICY "lesson_records_update_own" ON public.lesson_records FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()));
CREATE POLICY "lesson_records_delete_own" ON public.lesson_records FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX lesson_records_user_class_date_idx ON public.lesson_records (user_id, class_id, lesson_date DESC, created_at DESC);
CREATE TRIGGER lesson_records_set_updated_at BEFORE UPDATE ON public.lesson_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.lesson_record_students (
  lesson_record_id uuid NOT NULL REFERENCES public.lesson_records(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lesson_record_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_record_students TO authenticated;
GRANT ALL ON public.lesson_record_students TO service_role;
ALTER TABLE public.lesson_record_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_record_students_select_own" ON public.lesson_record_students FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lesson_record_students_insert_own" ON public.lesson_record_students FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.lesson_records r WHERE r.id = lesson_record_id AND r.user_id = auth.uid()) AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
CREATE POLICY "lesson_record_students_update_own" ON public.lesson_record_students FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_record_students_delete_own" ON public.lesson_record_students FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX lesson_record_students_user_student_idx ON public.lesson_record_students (user_id, student_id);

CREATE OR REPLACE FUNCTION public.seed_demo_for_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  class_uuid uuid := gen_random_uuid();
  ana_uuid uuid := gen_random_uuid();
  joao_uuid uuid := gen_random_uuid();
  carlos_uuid uuid := gen_random_uuid();
  mariana_uuid uuid := gen_random_uuid();
  record_one uuid := gen_random_uuid();
  record_two uuid := gen_random_uuid();
  record_three uuid := gen_random_uuid();
BEGIN
  INSERT INTO public.classes (id, user_id, name, subject, grade, notes, last_accessed_at)
  VALUES (class_uuid, NEW.id, '8º B', 'Matemática', '8º ano', 'Turma de demonstração para começar a organizar sua memória pedagógica.', now());

  INSERT INTO public.students (id, user_id, class_id, name, notes) VALUES
    (ana_uuid, NEW.id, class_uuid, 'Ana', 'Participa bem quando ganha confiança.'),
    (joao_uuid, NEW.id, class_uuid, 'João', 'Acompanhar a concentração durante atividades longas.'),
    (carlos_uuid, NEW.id, class_uuid, 'Carlos', NULL),
    (mariana_uuid, NEW.id, class_uuid, 'Mariana', 'Costuma apoiar os colegas nas atividades em grupo.');

  INSERT INTO public.lesson_records (id, user_id, class_id, lesson_date, content, status, perception, notes, pending) VALUES
    (record_one, NEW.id, class_uuid, current_date - 7, 'Introdução a frações equivalentes', 'completed', 'good', 'A turma participou bem dos exemplos visuais. Mariana ajudou o grupo durante a atividade.', 'Retomar simplificação no início da próxima aula.'),
    (record_two, NEW.id, class_uuid, current_date - 4, 'Simplificação de frações', 'partial', 'average', 'A turma teve dificuldade na simplificação. Ana melhorou bastante e João estava disperso.', 'Exercícios 7 e 8.'),
    (record_three, NEW.id, class_uuid, current_date - 1, 'Comparação de frações', 'partial', 'average', 'Os exemplos na reta numérica ajudaram. Carlos ainda confunde denominadores diferentes.', 'Revisar comparação antes de avançar.');

  INSERT INTO public.lesson_record_students (lesson_record_id, student_id, user_id) VALUES
    (record_one, mariana_uuid, NEW.id),
    (record_two, ana_uuid, NEW.id),
    (record_two, joao_uuid, NEW.id),
    (record_three, carlos_uuid, NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER seed_demo_after_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.seed_demo_for_profile();