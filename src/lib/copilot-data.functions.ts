import { createServerFn } from "@tanstack/react-start";

export type CopilotVacante = {
  id: string;
  cargo: string;
  empresa: string | null;
  ciudad: string | null;
  nivel: string | null;
  modalidad: string | null;
  estado: string | null;
  perfil_ideal: string | null;
  descripcion: string | null;
  objetivo_cargo: string | null;
  competencias: string[] | null;
  updated_at: string | null;
};

export type CopilotCandidato = {
  id: string;
  nombre: string;
  compatibilidad: number | null;
  recomendacion: string | null;
  resumen: string | null;
  fortalezas: string[];
  riesgos: string[];
  competencias: string[];
};

export const listVacantesForCopilot = createServerFn({ method: "GET" }).handler(
  async (): Promise<CopilotVacante[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("vacantes")
      .select(
        "id, cargo, empresa, ciudad, nivel, modalidad, estado, perfil_ideal, descripcion, objetivo_cargo, competencias, updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as CopilotVacante[];
  },
);

export const listCandidatosForVacante = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as { vacanteId?: string };
    return { vacanteId: String(d.vacanteId ?? "") };
  })
  .handler(async ({ data }): Promise<CopilotCandidato[]> => {
    if (!data.vacanteId) return [];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("evaluaciones_ia")
      .select(
        "compatibilidad, recomendacion, resumen_ejecutivo, fortalezas, riesgos, competencias_detectadas, candidatos(id, nombre_completo)",
      )
      .eq("vacante_id", data.vacanteId)
      .order("compatibilidad", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    type Row = {
      compatibilidad: number | null;
      recomendacion: string | null;
      resumen_ejecutivo: string | null;
      fortalezas: string[] | null;
      riesgos: string[] | null;
      competencias_detectadas: string[] | null;
      candidatos: { id: string; nombre_completo: string } | null;
    };
    return ((rows ?? []) as Row[])
      .filter((r) => r.candidatos)
      .map((r) => ({
        id: r.candidatos!.id,
        nombre: r.candidatos!.nombre_completo,
        compatibilidad: r.compatibilidad,
        recomendacion: r.recomendacion,
        resumen: r.resumen_ejecutivo,
        fortalezas: r.fortalezas ?? [],
        riesgos: r.riesgos ?? [],
        competencias: r.competencias_detectadas ?? [],
      }));
  });

export const appendCandidatoNota = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as { candidatoId?: string; nota?: string };
    return {
      candidatoId: String(d.candidatoId ?? ""),
      nota: String(d.nota ?? "").slice(0, 20000),
    };
  })
  .handler(async ({ data }) => {
    if (!data.candidatoId || !data.nota) throw new Error("Datos incompletos");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: current, error: e1 } = await supabaseAdmin
      .from("candidatos")
      .select("notas")
      .eq("id", data.candidatoId)
      .maybeSingle();
    if (e1) throw new Error(e1.message);
    const prev = current?.notas ? `${current.notas}\n\n` : "";
    const nuevo = `${prev}${data.nota}`;
    const { error: e2 } = await supabaseAdmin
      .from("candidatos")
      .update({ notas: nuevo })
      .eq("id", data.candidatoId);
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });
