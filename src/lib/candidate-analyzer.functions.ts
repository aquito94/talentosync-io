import { createServerFn } from "@tanstack/react-start";

export type VacancyCtx = {
  cargo: string;
  empresa: string;
  ciudad?: string;
  departamento?: string;
  modalidad?: string;
  nivel?: string;
};

export type AnalysisResult = {
  candidato: string;
  cargoActual: string;
  empresaActual: string;
  compatibilidad: number;
  recomendacion: "A+" | "A" | "B" | "C";
  nivelRecomendacion: string;
  competenciasBadges: string[];
  resumen: string;
  experiencia: string[];
  educacion: string[];
  competenciasTecnicas: { nombre: string; nivel: number }[];
  competenciasBlandas: string[];
  idiomas: string[];
  certificaciones: string[];
  fortalezas: string[];
  riesgos: string[];
  brechas: string[];
  preguntasStar: string[];
  justificacion: string;
  liderazgo: number;
  estabilidad: number;
  ajusteCultural: number;
  aniosExperiencia: number;
};

const toStr = (v: unknown, d = ""): string => (typeof v === "string" ? v : v == null ? d : String(v));
const toNum = (v: unknown, d = 0): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : d;
};
const toStrArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => toStr(x)).filter(Boolean) : [];
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function extractJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  try { return JSON.parse(candidate); }
  catch {
    const s = candidate.indexOf("{"); const e = candidate.lastIndexOf("}");
    if (s !== -1 && e > s) return JSON.parse(candidate.slice(s, e + 1));
    throw new Error("La IA no devolvió JSON válido");
  }
}

function normalizeAnalysis(raw: Record<string, unknown>, fallbackName: string): AnalysisResult {
  const compat = clamp(Math.round(toNum(raw.compatibilidad, 0)), 0, 100);
  const rec = ((): AnalysisResult["recomendacion"] => {
    const r = toStr(raw.recomendacion).toUpperCase().trim();
    if (r === "A+" || r === "A" || r === "B" || r === "C") return r as AnalysisResult["recomendacion"];
    return compat >= 90 ? "A+" : compat >= 80 ? "A" : compat >= 70 ? "B" : "C";
  })();
  const tec = Array.isArray(raw.competenciasTecnicas)
    ? (raw.competenciasTecnicas as unknown[]).map((k) => {
        const o = (k ?? {}) as Record<string, unknown>;
        return { nombre: toStr(o.nombre ?? o.name), nivel: clamp(Math.round(toNum(o.nivel ?? o.level, 60)), 0, 100) };
      }).filter((x) => x.nombre)
    : [];
  return {
    candidato: toStr(raw.candidato, fallbackName) || fallbackName,
    cargoActual: toStr(raw.cargoActual),
    empresaActual: toStr(raw.empresaActual),
    compatibilidad: compat,
    recomendacion: rec,
    nivelRecomendacion: toStr(raw.nivelRecomendacion,
      rec === "A+" ? "Altamente recomendado" : rec === "A" ? "Recomendado" : rec === "B" ? "Considerar" : "No recomendado"),
    competenciasBadges: toStrArr(raw.competenciasBadges ?? tec.map((t) => t.nombre)).slice(0, 8),
    resumen: toStr(raw.resumen),
    experiencia: toStrArr(raw.experiencia),
    educacion: toStrArr(raw.educacion),
    competenciasTecnicas: tec,
    competenciasBlandas: toStrArr(raw.competenciasBlandas),
    idiomas: toStrArr(raw.idiomas),
    certificaciones: toStrArr(raw.certificaciones),
    fortalezas: toStrArr(raw.fortalezas),
    riesgos: toStrArr(raw.riesgos),
    brechas: toStrArr(raw.brechas),
    preguntasStar: toStrArr(raw.preguntasStar),
    justificacion: toStr(raw.justificacion),
    liderazgo: clamp(Math.round(toNum(raw.liderazgo, 60)), 0, 100),
    estabilidad: clamp(Math.round(toNum(raw.estabilidad, 60)), 0, 100),
    ajusteCultural: clamp(Math.round(toNum(raw.ajusteCultural, 60)), 0, 100),
    aniosExperiencia: clamp(Math.round(toNum(raw.aniosExperiencia, 0)), 0, 60),
  };
}

async function callGemini(system: string, user: string, model = "google/gemini-2.5-pro"): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Límite de uso alcanzado. Intenta de nuevo pronto.");
    if (res.status === 402) throw new Error("Créditos de IA agotados. Recarga en Configuración.");
    throw new Error(`IA [${res.status}]: ${body.slice(0, 300)}`);
  }
  const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = j.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("La IA no devolvió contenido");
  return content;
}

export const analyzeCV = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as { fileName?: string; text?: string; vacancy?: VacancyCtx };
    return {
      fileName: String(d.fileName ?? "cv").slice(0, 200),
      text: String(d.text ?? "").slice(0, 60000),
      vacancy: {
        cargo: String(d.vacancy?.cargo ?? "").slice(0, 200),
        empresa: String(d.vacancy?.empresa ?? "").slice(0, 200),
        ciudad: d.vacancy?.ciudad ? String(d.vacancy.ciudad).slice(0, 100) : undefined,
        departamento: d.vacancy?.departamento ? String(d.vacancy.departamento).slice(0, 100) : undefined,
        modalidad: d.vacancy?.modalidad ? String(d.vacancy.modalidad).slice(0, 60) : undefined,
        nivel: d.vacancy?.nivel ? String(d.vacancy.nivel).slice(0, 60) : undefined,
      } satisfies VacancyCtx,
    };
  })
  .handler(async ({ data }): Promise<AnalysisResult> => {
    if (!data.text || data.text.length < 40) {
      throw new Error("No se pudo extraer texto útil del CV. Verifica que el archivo no esté escaneado o protegido.");
    }
    const schema = `{
  "candidato": "Nombre completo del candidato tal como aparece en el CV",
  "cargoActual": "Cargo actual o más reciente",
  "empresaActual": "Empresa actual o más reciente",
  "aniosExperiencia": 0,
  "compatibilidad": 0,
  "recomendacion": "A+ | A | B | C",
  "nivelRecomendacion": "Altamente recomendado | Recomendado | Considerar | No recomendado",
  "resumen": "Resumen ejecutivo (3-4 frases) explicando ajuste con la vacante",
  "competenciasBadges": ["3-6 habilidades clave para tarjeta"],
  "experiencia": ["Cargo — Empresa · Duración · Logros clave", "..."],
  "educacion": ["Título — Institución · Año", "..."],
  "competenciasTecnicas": [{"nombre": "React", "nivel": 85}],
  "competenciasBlandas": ["Comunicación", "..."],
  "idiomas": ["Español (Nativo)", "Inglés (C1)"],
  "certificaciones": ["Nombre — Emisor · Año"],
  "fortalezas": ["3-5 fortalezas concretas"],
  "riesgos": ["3-5 riesgos, gaps o red flags"],
  "brechas": ["Brechas específicas contra la vacante"],
  "preguntasStar": ["4-6 preguntas STAR personalizadas para este perfil y vacante"],
  "justificacion": "Justificación 2-3 frases del ranking y recomendación",
  "liderazgo": 0,
  "estabilidad": 0,
  "ajusteCultural": 0
}`;

    const system = `Eres un reclutador senior experto en evaluación de talento. Analizas el CV frente a la vacante y devuelves SIEMPRE un JSON válido siguiendo exactamente este esquema (sin markdown, sin texto extra):
${schema}
Reglas:
- Puntuaciones (compatibilidad, liderazgo, estabilidad, ajusteCultural, nivel) en escala 0-100 con criterio realista.
- Si algún dato no está en el CV, infiere razonablemente o usa "" / [].
- Español neutro, profesional. Sé específico, no genérico.`;

    const v = data.vacancy;
    const user = `VACANTE:
- Cargo: ${v.cargo}
- Empresa: ${v.empresa}
- Ciudad: ${v.ciudad ?? "—"}
- Departamento: ${v.departamento ?? "—"}
- Modalidad: ${v.modalidad ?? "—"}
- Nivel: ${v.nivel ?? "—"}

CV (${data.fileName}):
"""
${data.text}
"""

Devuelve el JSON.`;

    const content = await callGemini(system, user, "google/gemini-2.5-pro");
    const parsed = extractJson(content);
    return normalizeAnalysis(parsed, data.fileName.replace(/\.(pdf|docx)$/i, ""));
  });

// ---------- Quick actions ----------
export type QuickActionKey = "hidden" | "compare" | "risks" | "star" | "cultural";

export type QuickActionResult = {
  titulo: string;
  intro: string;
  secciones: { titulo: string; items: string[] }[];
};

export const runQuickAction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as {
      action?: QuickActionKey;
      vacancy?: VacancyCtx;
      candidates?: {
        candidato: string; cargoActual?: string; resumen?: string;
        competencias?: string[]; fortalezas?: string[]; riesgos?: string[];
        compatibilidad?: number; aniosExperiencia?: number;
      }[];
    };
    return {
      action: (["hidden", "compare", "risks", "star", "cultural"].includes(String(d.action)) ? d.action : "hidden") as QuickActionKey,
      vacancy: {
        cargo: String(d.vacancy?.cargo ?? ""),
        empresa: String(d.vacancy?.empresa ?? ""),
        ciudad: d.vacancy?.ciudad ? String(d.vacancy.ciudad) : undefined,
        modalidad: d.vacancy?.modalidad ? String(d.vacancy.modalidad) : undefined,
        nivel: d.vacancy?.nivel ? String(d.vacancy.nivel) : undefined,
      } satisfies VacancyCtx,
      candidates: Array.isArray(d.candidates) ? d.candidates.slice(0, 10).map((c) => ({
        candidato: String(c.candidato ?? "Candidato"),
        cargoActual: String(c.cargoActual ?? ""),
        resumen: String(c.resumen ?? "").slice(0, 800),
        competencias: Array.isArray(c.competencias) ? c.competencias.map(String).slice(0, 10) : [],
        fortalezas: Array.isArray(c.fortalezas) ? c.fortalezas.map(String).slice(0, 6) : [],
        riesgos: Array.isArray(c.riesgos) ? c.riesgos.map(String).slice(0, 6) : [],
        compatibilidad: Math.round(Number(c.compatibilidad ?? 0)),
        aniosExperiencia: Math.round(Number(c.aniosExperiencia ?? 0)),
      })) : [],
    };
  })
  .handler(async ({ data }): Promise<QuickActionResult> => {
    if (!data.candidates.length) throw new Error("No hay candidatos analizados para procesar.");

    const prompts: Record<QuickActionKey, { titulo: string; instruccion: string }> = {
      hidden: {
        titulo: "Competencias ocultas detectadas",
        instruccion: "Identifica competencias transferibles o habilidades no obvias que enriquecen el perfil frente a la vacante. Para cada candidato lista 3-5 competencias ocultas con una frase de justificación.",
      },
      compare: {
        titulo: "Comparativa ejecutiva",
        instruccion: "Compara los candidatos entre sí. Devuelve una sección 'Ranking recomendado' (orden y por qué), una 'Diferenciales clave' por candidato, y una 'Recomendación final' (a quién avanzar).",
      },
      risks: {
        titulo: "Análisis de riesgos",
        instruccion: "Identifica gaps, rotación alta, sobrecalificación, brechas técnicas y red flags. Para cada candidato lista 3-5 riesgos concretos con impacto y mitigación sugerida.",
      },
      star: {
        titulo: "Preguntas STAR personalizadas",
        instruccion: "Genera 5-7 preguntas STAR por candidato, cada una enfocada en una competencia clave o riesgo detectado. Formato: 'Competencia — pregunta'.",
      },
      cultural: {
        titulo: "Ajuste cultural",
        instruccion: "Evalúa el fit cultural con la empresa/rol. Para cada candidato lista 3-5 puntos: aspectos alineados y aspectos a validar en entrevista cultural.",
      },
    };

    const p = prompts[data.action];
    const schema = `{
  "titulo": "string",
  "intro": "1-2 frases resumen",
  "secciones": [{ "titulo": "Nombre del candidato o sección", "items": ["punto 1", "punto 2"] }]
}`;

    const system = `Eres un reclutador senior. ${p.instruccion} Responde SIEMPRE con JSON válido conforme a este esquema (sin markdown, sin texto extra):
${schema}`;

    const user = `VACANTE: ${data.vacancy.cargo} · ${data.vacancy.empresa} · ${data.vacancy.ciudad ?? "—"} · Nivel ${data.vacancy.nivel ?? "—"}

CANDIDATOS ANALIZADOS:
${data.candidates.map((c, i) => `${i + 1}. ${c.candidato} — ${c.cargoActual} · ${c.compatibilidad}% compat · ${c.aniosExperiencia}a exp
   Competencias: ${c.competencias.join(", ")}
   Fortalezas: ${c.fortalezas.join(" | ")}
   Riesgos: ${c.riesgos.join(" | ")}
   Resumen: ${c.resumen}`).join("\n\n")}

Devuelve el JSON.`;

    const content = await callGemini(system, user, "google/gemini-2.5-flash");
    const parsed = extractJson(content);
    const secs = Array.isArray(parsed.secciones)
      ? (parsed.secciones as unknown[]).map((s) => {
          const o = (s ?? {}) as Record<string, unknown>;
          return { titulo: toStr(o.titulo, "Sección"), items: toStrArr(o.items) };
        }).filter((s) => s.items.length > 0)
      : [];
    return {
      titulo: toStr(parsed.titulo, p.titulo),
      intro: toStr(parsed.intro),
      secciones: secs,
    };
  });
