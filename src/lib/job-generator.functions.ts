import { createServerFn } from "@tanstack/react-start";

export type JobInput = {
  cargo: string;
  empresa: string;
  ciudad: string;
  departamento?: string;
  modalidad?: string;
  tipoContratacion?: string;
  nivel?: string;
  salarioMin?: string;
  salarioMax?: string;
  competencias?: string[];
  beneficios?: string[];
  objetivoCargo?: string;
};

export type JobVacancy = {
  resumen: string;
  descripcion: string;
  responsabilidades: string[];
  perfil: { debeTener: string[]; deseable: string[] };
  competencias: { tecnicas: string[]; blandas: string[] };
  beneficios: string[];
  kpis: { nombre: string; meta: string }[];
  preguntasStar: { categoria: string; pregunta: string }[];
  palabrasAts: string[];
};

const toStrArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];

function normalize(raw: Record<string, unknown>): JobVacancy {
  const perfil = (raw.perfil ?? {}) as Record<string, unknown>;
  const competencias = (raw.competencias ?? {}) as Record<string, unknown>;
  const kpis = Array.isArray(raw.kpis)
    ? (raw.kpis as unknown[]).map((k) => {
        const o = (k ?? {}) as Record<string, unknown>;
        return {
          nombre: String(o.nombre ?? o.name ?? ""),
          meta: String(o.meta ?? o.target ?? o.valor ?? ""),
        };
      })
    : [];
  const star = Array.isArray(raw.preguntasStar ?? raw.star)
    ? ((raw.preguntasStar ?? raw.star) as unknown[]).map((q) => {
        const o = (q ?? {}) as Record<string, unknown>;
        return {
          categoria: String(o.categoria ?? o.category ?? ""),
          pregunta: String(o.pregunta ?? o.question ?? ""),
        };
      })
    : [];
  return {
    resumen: String(raw.resumen ?? ""),
    descripcion: String(raw.descripcion ?? ""),
    responsabilidades: toStrArray(raw.responsabilidades),
    perfil: {
      debeTener: toStrArray(perfil.debeTener ?? perfil.must ?? perfil.requeridos),
      deseable: toStrArray(perfil.deseable ?? perfil.nice ?? perfil.deseables),
    },
    competencias: {
      tecnicas: toStrArray(competencias.tecnicas ?? competencias.hard),
      blandas: toStrArray(competencias.blandas ?? competencias.soft),
    },
    beneficios: toStrArray(raw.beneficios),
    kpis,
    preguntasStar: star,
    palabrasAts: toStrArray(raw.palabrasAts ?? raw.ats),
  };
}

function extractJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("La IA no devolvió un JSON válido");
  }
}

export const generateJobDescription = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): JobInput => {
    const d = (data ?? {}) as Partial<JobInput>;
    return {
      cargo: String(d.cargo ?? "").slice(0, 200),
      empresa: String(d.empresa ?? "").slice(0, 200),
      ciudad: String(d.ciudad ?? "").slice(0, 200),
      departamento: d.departamento ? String(d.departamento).slice(0, 100) : undefined,
      modalidad: d.modalidad ? String(d.modalidad).slice(0, 60) : undefined,
      tipoContratacion: d.tipoContratacion ? String(d.tipoContratacion).slice(0, 60) : undefined,
      nivel: d.nivel ? String(d.nivel).slice(0, 60) : undefined,
      salarioMin: d.salarioMin ? String(d.salarioMin).slice(0, 40) : undefined,
      salarioMax: d.salarioMax ? String(d.salarioMax).slice(0, 40) : undefined,
      competencias: Array.isArray(d.competencias) ? d.competencias.map(String).slice(0, 40) : undefined,
      beneficios: Array.isArray(d.beneficios) ? d.beneficios.map(String).slice(0, 40) : undefined,
      objetivoCargo: d.objetivoCargo ? String(d.objetivoCargo).slice(0, 2000) : undefined,
    };
  })
  .handler(async ({ data }): Promise<JobVacancy> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");

    const schemaHint = `{
  "resumen": "string (2-3 frases, resumen ejecutivo)",
  "descripcion": "string (2-4 párrafos)",
  "responsabilidades": ["string", ...],
  "perfil": { "debeTener": ["string"], "deseable": ["string"] },
  "competencias": { "tecnicas": ["string"], "blandas": ["string"] },
  "beneficios": ["string"],
  "kpis": [{ "nombre": "string", "meta": "string" }],
  "preguntasStar": [{ "categoria": "Situación|Tarea|Acción|Resultado", "pregunta": "string" }],
  "palabrasAts": ["string"]
}`;

    const userPayload = {
      cargo: data.cargo,
      empresa: data.empresa,
      ciudad: data.ciudad,
      departamento: data.departamento,
      modalidad: data.modalidad,
      tipoContratacion: data.tipoContratacion,
      nivel: data.nivel,
      rangoSalarial:
        data.salarioMin || data.salarioMax
          ? `${data.salarioMin ?? "-"} a ${data.salarioMax ?? "-"}`
          : undefined,
      competencias: data.competencias,
      beneficios: data.beneficios,
      objetivoCargo: data.objetivoCargo,
    };

    const systemPrompt = `Eres un experto en reclutamiento y redacción de vacantes en español. Genera descripciones de cargo profesionales, inclusivas y optimizadas para ATS. Responde SIEMPRE únicamente con un objeto JSON válido, sin markdown, sin texto adicional. Sigue exactamente este esquema:\n${schemaHint}`;

    const userPrompt = `Genera la vacante en JSON según el esquema, usando estos datos del formulario:\n${JSON.stringify(userPayload, null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 429) throw new Error("Límite de uso alcanzado. Intenta de nuevo en un momento.");
      if (response.status === 402) throw new Error("Créditos de IA agotados. Recarga en Settings.");
      throw new Error(`Gemini [${response.status}]: ${errorBody.slice(0, 300)}`);
    }

    const result = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = result.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("La IA no devolvió contenido");

    const parsed = extractJson(content);
    return normalize(parsed);
  });
