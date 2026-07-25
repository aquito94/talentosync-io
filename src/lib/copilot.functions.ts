import { createServerFn } from "@tanstack/react-start";

export type CopilotMsg = { role: "user" | "assistant"; content: string };

export type CopilotContext = {
  vacante?: {
    cargo?: string;
    empresa?: string;
    ciudad?: string;
    nivel?: string;
    modalidad?: string;
    estado?: string;
    resumen?: string;
    descripcion?: string;
    competencias?: string[];
    updated_at?: string;
  } | null;
  candidatos?: Array<{
    nombre: string;
    compatibilidad?: number | null;
    recomendacion?: string | null;
    resumen?: string | null;
    fortalezas?: string[];
    riesgos?: string[];
    competencias?: string[];
  }>;
};

export type CopilotInput = {
  messages: CopilotMsg[];
  context?: CopilotContext;
};

const clampStr = (v: unknown, n = 4000) => (typeof v === "string" ? v.slice(0, n) : "");
const clampArr = (v: unknown, n = 200): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean).slice(0, n) : [];

export const askCopilot = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): CopilotInput => {
    const d = (data ?? {}) as Partial<CopilotInput>;
    const messages = Array.isArray(d.messages) ? d.messages : [];
    return {
      messages: messages
        .map((m): CopilotMsg => ({
          role: m?.role === "assistant" ? "assistant" : "user",
          content: clampStr(m?.content, 8000),
        }))
        .filter((m) => m.content)
        .slice(-30),

      context: d.context ?? undefined,
    };
  })
  .handler(async ({ data }): Promise<{ content: string }> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");

    const systemPrompt = `Eres RecruitAI Copilot, un asistente Enterprise de RRHH experto en reclutamiento, selección, entrevistas y people analytics. Responde SIEMPRE en español, con tono profesional y formato de informe ejecutivo:
- Encabezados en negrita usando "**TÍTULO**" en mayúsculas.
- Listas con guiones "- ".
- Párrafos cortos y accionables.
- Cuando compares candidatos, ordénalos por compatibilidad.
- Cuando redactes correos, incluye Asunto y cuerpo.
Nunca inventes datos: apóyate estrictamente en el CONTEXTO DEL PROCESO. Si falta información, dilo explícitamente y sugiere el siguiente paso.`;

    const ctx = data.context ?? {};
    const ctxLines: string[] = ["=== CONTEXTO DEL PROCESO ==="];
    if (ctx.vacante) {
      const v = ctx.vacante;
      ctxLines.push(`Vacante: ${v.cargo ?? "-"}`);
      ctxLines.push(`Empresa: ${v.empresa ?? "-"}`);
      if (v.ciudad) ctxLines.push(`Ciudad: ${v.ciudad}`);
      if (v.nivel) ctxLines.push(`Nivel: ${v.nivel}`);
      if (v.modalidad) ctxLines.push(`Modalidad: ${v.modalidad}`);
      if (v.estado) ctxLines.push(`Etapa: ${v.estado}`);
      if (v.competencias?.length) ctxLines.push(`Competencias clave: ${clampArr(v.competencias).join(", ")}`);
      if (v.resumen) ctxLines.push(`Resumen: ${clampStr(v.resumen, 800)}`);
      if (v.descripcion) ctxLines.push(`Descripción: ${clampStr(v.descripcion, 1200)}`);
    } else {
      ctxLines.push("No hay vacante seleccionada.");
    }
    const cands = ctx.candidatos ?? [];
    if (cands.length) {
      ctxLines.push(`\nCandidatos evaluados (${cands.length}):`);
      cands.slice(0, 15).forEach((c, i) => {
        ctxLines.push(
          `${i + 1}. ${c.nombre} — compatibilidad ${c.compatibilidad ?? "-"}% — recomendación: ${c.recomendacion ?? "-"}`,
        );
        if (c.resumen) ctxLines.push(`   Resumen: ${clampStr(c.resumen, 400)}`);
        if (c.fortalezas?.length) ctxLines.push(`   Fortalezas: ${clampArr(c.fortalezas, 8).join("; ")}`);
        if (c.riesgos?.length) ctxLines.push(`   Riesgos: ${clampArr(c.riesgos, 8).join("; ")}`);
        if (c.competencias?.length) ctxLines.push(`   Competencias: ${clampArr(c.competencias, 12).join(", ")}`);
      });
    } else {
      ctxLines.push("\nAún no hay candidatos analizados para esta vacante.");
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: ctxLines.join("\n") },
      ...data.messages,
    ];

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });

    if (!r.ok) {
      const body = await r.text();
      if (r.status === 429) throw new Error("Límite de uso alcanzado. Intenta de nuevo en un momento.");
      if (r.status === 402) throw new Error("Créditos de IA agotados. Recarga en Configuración.");
      throw new Error(`Copiloto IA [${r.status}]: ${body.slice(0, 300)}`);
    }

    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const content = j.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("La IA no devolvió contenido");
    return { content };
  });
