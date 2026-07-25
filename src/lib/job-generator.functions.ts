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
    const url = process.env.EXTERNAL_SUPABASE_URL;
    const anonKey = process.env.EXTERNAL_SUPABASE_ANON_KEY;
    if (!url || !anonKey) throw new Error("Supabase externo no está configurado");

    const response = await fetch(`${url}/functions/v1/generate-job-description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ cargo: data.cargo, empresa: data.empresa, ciudad: data.ciudad }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Edge Function [${response.status}]: ${errorBody}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const result = (await response.json()) as Record<string, unknown>;
      const text =
        (result.text as string | undefined) ??
        (result.generatedText as string | undefined) ??
        (result.content as string | undefined) ??
        (result.message as string | undefined) ??
        JSON.stringify(result, null, 2);
      return { text };
    }
    return { text: await response.text() };
  });
