
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'reclutador', 'manager', 'visualizador');
CREATE TYPE public.estado_vacante AS ENUM ('borrador', 'publicada', 'pausada', 'cerrada', 'archivada');
CREATE TYPE public.modalidad_trabajo AS ENUM ('presencial', 'remoto', 'hibrido');
CREATE TYPE public.tipo_contratacion AS ENUM ('indefinido', 'temporal', 'obra_labor', 'prestacion_servicios', 'practicas', 'freelance');
CREATE TYPE public.nivel_cargo AS ENUM ('junior', 'semi_senior', 'senior', 'lead', 'manager', 'director', 'ejecutivo');
CREATE TYPE public.estado_candidato AS ENUM ('nuevo', 'en_revision', 'preseleccionado', 'entrevista', 'oferta', 'contratado', 'descartado');
CREATE TYPE public.etapa_proceso AS ENUM ('aplicacion', 'screening', 'entrevista_inicial', 'prueba_tecnica', 'entrevista_final', 'oferta', 'contratado', 'rechazado');
CREATE TYPE public.prioridad AS ENUM ('baja', 'media', 'alta', 'urgente');
CREATE TYPE public.tipo_entrevista AS ENUM ('telefonica', 'video', 'presencial', 'tecnica', 'panel', 'cultural');
CREATE TYPE public.resultado_entrevista AS ENUM ('pendiente', 'aprobado', 'rechazado', 'en_espera');
CREATE TYPE public.categoria_prompt AS ENUM ('vacantes', 'candidatos', 'correos', 'entrevistas', 'analisis', 'reportes', 'general');
CREATE TYPE public.tipo_correo AS ENUM ('invitacion', 'rechazo', 'oferta', 'seguimiento', 'agendamiento', 'bienvenida', 'personalizado');
CREATE TYPE public.estado_correo AS ENUM ('borrador', 'enviado', 'programado', 'fallido');

-- =========================================
-- FUNCIÓN GENÉRICA updated_at
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PERFILES USUARIOS
-- =========================================
CREATE TABLE public.perfiles_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT,
  correo TEXT,
  empresa TEXT,
  cargo TEXT,
  telefono TEXT,
  avatar_url TEXT,
  zona_horaria TEXT DEFAULT 'America/Bogota',
  idioma TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_perfiles_user_id ON public.perfiles_usuarios(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfiles_usuarios TO authenticated;
GRANT ALL ON public.perfiles_usuarios TO service_role;
ALTER TABLE public.perfiles_usuarios ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_perfiles_updated BEFORE UPDATE ON public.perfiles_usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- ROLES USUARIOS (separado por seguridad)
-- =========================================
CREATE TABLE public.roles_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, rol)
);
CREATE INDEX idx_roles_user_id ON public.roles_usuarios(user_id);
GRANT SELECT ON public.roles_usuarios TO authenticated;
GRANT ALL ON public.roles_usuarios TO service_role;
ALTER TABLE public.roles_usuarios ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.roles_usuarios
    WHERE user_id = _user_id AND rol = _role
  )
$$;

-- Políticas perfiles
CREATE POLICY "perfiles_select_propio_o_admin" ON public.perfiles_usuarios FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "perfiles_insert_propio" ON public.perfiles_usuarios FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perfiles_update_propio" ON public.perfiles_usuarios FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "perfiles_delete_admin" ON public.perfiles_usuarios FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas roles
CREATE POLICY "roles_select_propio_o_admin" ON public.roles_usuarios FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================
-- VACANTES
-- =========================================
CREATE TABLE public.vacantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cargo TEXT NOT NULL,
  empresa TEXT,
  ciudad TEXT,
  departamento TEXT,
  modalidad public.modalidad_trabajo,
  tipo_contratacion public.tipo_contratacion,
  nivel public.nivel_cargo,
  salario_min NUMERIC(12,2),
  salario_max NUMERIC(12,2),
  moneda TEXT DEFAULT 'COP',
  objetivo_cargo TEXT,
  descripcion TEXT,
  responsabilidades TEXT[],
  perfil_ideal TEXT,
  competencias TEXT[],
  beneficios TEXT[],
  kpis TEXT[],
  preguntas_star JSONB DEFAULT '[]'::jsonb,
  palabras_clave_ats TEXT[],
  estado public.estado_vacante NOT NULL DEFAULT 'borrador',
  fecha_publicacion TIMESTAMPTZ,
  fecha_cierre TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_vacantes_user_id ON public.vacantes(user_id);
CREATE INDEX idx_vacantes_estado ON public.vacantes(estado);
CREATE INDEX idx_vacantes_created_at ON public.vacantes(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vacantes TO authenticated;
GRANT ALL ON public.vacantes TO service_role;
ALTER TABLE public.vacantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vacantes_all_propio_o_admin" ON public.vacantes FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_vacantes_updated BEFORE UPDATE ON public.vacantes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- CANDIDATOS
-- =========================================
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  correo TEXT,
  telefono TEXT,
  ciudad TEXT,
  pais TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  cv_url TEXT,
  cv_storage_path TEXT,
  resumen_profesional TEXT,
  experiencia_anos NUMERIC(4,1),
  experiencia JSONB DEFAULT '[]'::jsonb,
  educacion JSONB DEFAULT '[]'::jsonb,
  competencias TEXT[],
  idiomas JSONB DEFAULT '[]'::jsonb,
  pretension_salarial NUMERIC(12,2),
  moneda TEXT DEFAULT 'COP',
  disponibilidad TEXT,
  estado public.estado_candidato NOT NULL DEFAULT 'nuevo',
  notas TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_candidatos_user_id ON public.candidatos(user_id);
CREATE INDEX idx_candidatos_estado ON public.candidatos(estado);
CREATE INDEX idx_candidatos_correo ON public.candidatos(correo);
CREATE INDEX idx_candidatos_created_at ON public.candidatos(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidatos TO authenticated;
GRANT ALL ON public.candidatos TO service_role;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "candidatos_all_propio_o_admin" ON public.candidatos FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_candidatos_updated BEFORE UPDATE ON public.candidatos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PROCESOS DE SELECCIÓN
-- =========================================
CREATE TABLE public.procesos_seleccion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vacante_id UUID NOT NULL REFERENCES public.vacantes(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  etapa public.etapa_proceso NOT NULL DEFAULT 'aplicacion',
  prioridad public.prioridad NOT NULL DEFAULT 'media',
  puntuacion_general NUMERIC(5,2),
  fecha_aplicacion TIMESTAMPTZ DEFAULT now(),
  fecha_ultimo_cambio TIMESTAMPTZ DEFAULT now(),
  notas TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vacante_id, candidato_id)
);
CREATE INDEX idx_procesos_user_id ON public.procesos_seleccion(user_id);
CREATE INDEX idx_procesos_vacante ON public.procesos_seleccion(vacante_id);
CREATE INDEX idx_procesos_candidato ON public.procesos_seleccion(candidato_id);
CREATE INDEX idx_procesos_etapa ON public.procesos_seleccion(etapa);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.procesos_seleccion TO authenticated;
GRANT ALL ON public.procesos_seleccion TO service_role;
ALTER TABLE public.procesos_seleccion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "procesos_all_propio_o_admin" ON public.procesos_seleccion FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_procesos_updated BEFORE UPDATE ON public.procesos_seleccion
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- EVALUACIONES IA
-- =========================================
CREATE TABLE public.evaluaciones_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proceso_id UUID REFERENCES public.procesos_seleccion(id) ON DELETE CASCADE,
  vacante_id UUID REFERENCES public.vacantes(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  compatibilidad NUMERIC(5,2),
  resumen_ejecutivo TEXT,
  fortalezas TEXT[],
  riesgos TEXT[],
  coincidencia_criterios JSONB DEFAULT '{}'::jsonb,
  competencias_detectadas TEXT[],
  ajuste_cultural NUMERIC(5,2),
  preguntas_sugeridas JSONB DEFAULT '[]'::jsonb,
  recomendacion TEXT,
  modelo_ia TEXT,
  tokens_utilizados INTEGER,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_evaluaciones_user_id ON public.evaluaciones_ia(user_id);
CREATE INDEX idx_evaluaciones_proceso ON public.evaluaciones_ia(proceso_id);
CREATE INDEX idx_evaluaciones_candidato ON public.evaluaciones_ia(candidato_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluaciones_ia TO authenticated;
GRANT ALL ON public.evaluaciones_ia TO service_role;
ALTER TABLE public.evaluaciones_ia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evaluaciones_all_propio_o_admin" ON public.evaluaciones_ia FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_evaluaciones_updated BEFORE UPDATE ON public.evaluaciones_ia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- ENTREVISTAS
-- =========================================
CREATE TABLE public.entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proceso_id UUID NOT NULL REFERENCES public.procesos_seleccion(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  vacante_id UUID REFERENCES public.vacantes(id) ON DELETE SET NULL,
  fecha_programada TIMESTAMPTZ NOT NULL,
  duracion_minutos INTEGER DEFAULT 60,
  tipo public.tipo_entrevista NOT NULL DEFAULT 'video',
  entrevistador TEXT,
  entrevistador_correo TEXT,
  ubicacion_o_enlace TEXT,
  preguntas_star JSONB DEFAULT '[]'::jsonb,
  notas TEXT,
  puntuacion NUMERIC(5,2),
  resultado public.resultado_entrevista NOT NULL DEFAULT 'pendiente',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_entrevistas_user_id ON public.entrevistas(user_id);
CREATE INDEX idx_entrevistas_proceso ON public.entrevistas(proceso_id);
CREATE INDEX idx_entrevistas_fecha ON public.entrevistas(fecha_programada);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entrevistas TO authenticated;
GRANT ALL ON public.entrevistas TO service_role;
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entrevistas_all_propio_o_admin" ON public.entrevistas FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_entrevistas_updated BEFORE UPDATE ON public.entrevistas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PROMPTS (biblioteca)
-- =========================================
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT NOT NULL,
  categoria public.categoria_prompt NOT NULL DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb,
  etiquetas TEXT[],
  es_favorito BOOLEAN NOT NULL DEFAULT false,
  es_publico BOOLEAN NOT NULL DEFAULT false,
  veces_utilizado INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_categoria ON public.prompts(categoria);
CREATE INDEX idx_prompts_publico ON public.prompts(es_publico) WHERE es_publico = true;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompts_select_propio_publico_admin" ON public.prompts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR es_publico = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "prompts_insert_propio" ON public.prompts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prompts_update_propio_o_admin" ON public.prompts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "prompts_delete_propio_o_admin" ON public.prompts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_prompts_updated BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- CORREOS GENERADOS
-- =========================================
CREATE TABLE public.correos_generados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  proceso_id UUID REFERENCES public.procesos_seleccion(id) ON DELETE SET NULL,
  vacante_id UUID REFERENCES public.vacantes(id) ON DELETE SET NULL,
  destinatario_nombre TEXT,
  destinatario_correo TEXT NOT NULL,
  asunto TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  tipo public.tipo_correo NOT NULL DEFAULT 'personalizado',
  estado public.estado_correo NOT NULL DEFAULT 'borrador',
  fecha_envio TIMESTAMPTZ,
  fecha_programada TIMESTAMPTZ,
  modelo_ia TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_correos_user_id ON public.correos_generados(user_id);
CREATE INDEX idx_correos_candidato ON public.correos_generados(candidato_id);
CREATE INDEX idx_correos_estado ON public.correos_generados(estado);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.correos_generados TO authenticated;
GRANT ALL ON public.correos_generados TO service_role;
ALTER TABLE public.correos_generados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "correos_all_propio_o_admin" ON public.correos_generados FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_correos_updated BEFORE UPDATE ON public.correos_generados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- CONVERSACIONES COPILOT + MENSAJES
-- =========================================
CREATE TABLE public.conversaciones_copilot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proceso_id UUID REFERENCES public.procesos_seleccion(id) ON DELETE SET NULL,
  vacante_id UUID REFERENCES public.vacantes(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL DEFAULT 'Nueva conversación',
  contexto JSONB DEFAULT '{}'::jsonb,
  modelo_ia TEXT,
  archivada BOOLEAN NOT NULL DEFAULT false,
  ultimo_mensaje_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversaciones_user_id ON public.conversaciones_copilot(user_id);
CREATE INDEX idx_conversaciones_proceso ON public.conversaciones_copilot(proceso_id);
CREATE INDEX idx_conversaciones_updated ON public.conversaciones_copilot(ultimo_mensaje_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversaciones_copilot TO authenticated;
GRANT ALL ON public.conversaciones_copilot TO service_role;
ALTER TABLE public.conversaciones_copilot ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversaciones_all_propio_o_admin" ON public.conversaciones_copilot FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_conversaciones_updated BEFORE UPDATE ON public.conversaciones_copilot
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mensajes_copilot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversacion_id UUID NOT NULL REFERENCES public.conversaciones_copilot(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('user', 'assistant', 'system')),
  contenido TEXT NOT NULL,
  tokens INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mensajes_conversacion ON public.mensajes_copilot(conversacion_id, created_at);
CREATE INDEX idx_mensajes_user_id ON public.mensajes_copilot(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mensajes_copilot TO authenticated;
GRANT ALL ON public.mensajes_copilot TO service_role;
ALTER TABLE public.mensajes_copilot ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mensajes_all_propio_o_admin" ON public.mensajes_copilot FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_mensajes_updated BEFORE UPDATE ON public.mensajes_copilot
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- MÉTRICAS DASHBOARD
-- =========================================
CREATE TABLE public.metricas_dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  vacantes_activas INTEGER DEFAULT 0,
  vacantes_creadas INTEGER DEFAULT 0,
  candidatos_totales INTEGER DEFAULT 0,
  candidatos_nuevos INTEGER DEFAULT 0,
  entrevistas_realizadas INTEGER DEFAULT 0,
  entrevistas_programadas INTEGER DEFAULT 0,
  contrataciones INTEGER DEFAULT 0,
  tasa_conversion NUMERIC(5,2),
  tiempo_promedio_contratacion NUMERIC(6,2),
  evaluaciones_ia_ejecutadas INTEGER DEFAULT 0,
  correos_enviados INTEGER DEFAULT 0,
  tokens_ia_consumidos INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, fecha)
);
CREATE INDEX idx_metricas_user_fecha ON public.metricas_dashboard(user_id, fecha DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.metricas_dashboard TO authenticated;
GRANT ALL ON public.metricas_dashboard TO service_role;
ALTER TABLE public.metricas_dashboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "metricas_all_propio_o_admin" ON public.metricas_dashboard FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_metricas_updated BEFORE UPDATE ON public.metricas_dashboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- AUTO-CREAR PERFIL AL REGISTRARSE
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles_usuarios (user_id, nombre_completo, correo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.roles_usuarios (user_id, rol)
  VALUES (NEW.id, 'reclutador')
  ON CONFLICT (user_id, rol) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- STORAGE: políticas del bucket privado cvs-candidatos
-- (el bucket se crea vía tool storage_create_bucket)
-- =========================================
CREATE POLICY "cvs_select_propio_o_admin" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );
CREATE POLICY "cvs_insert_propio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cvs-candidatos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "cvs_update_propio" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "cvs_delete_propio_o_admin" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );
