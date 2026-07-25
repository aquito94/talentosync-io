import { createServerFn } from "@tanstack/react-start";

type JobInput = {
  cargo: string;
  empresa: string;
  ciudad: string;
};

export const generateJobDescription = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): JobInput => {
    const d = data as Partial<JobInput>;
    return {
      cargo: String(d?.cargo ?? "").slice(0, 200),
      empresa: String(d?.empresa ?? "").slice(0, 200),
      ciudad: String(d?.ciudad ?? "").slice(0, 200),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");

    const prompt = `Genera una descripción de vacante profesional en español para el siguiente cargo. Incluye: resumen, responsabilidades, requisitos y beneficios. Formato Markdown.

Cargo: ${data.cargo}
Empresa: ${data.empresa}
Ciudad: ${data.ciudad}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Eres un experto en reclutamiento que redacta descripciones de vacantes de alta calidad." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 429) throw new Error("Límite de solicitudes alcanzado. Intenta más tarde.");
      if (response.status === 402) throw new Error("Créditos de IA agotados. Agrega créditos en Ajustes.");
      throw new Error(`Error del proveedor de IA [${response.status}]: ${errorBody}`);
    }

    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content ?? "";
    return { text };
  });
