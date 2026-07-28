// Client-only CV text extraction (PDF via pdfjs-dist, DOCX via mammoth).
// Both libs run in the browser; we lazy-import to keep bundle small.

// @ts-expect-error - no bundled types for the browser entry
import * as mammothBrowser from "mammoth/mammoth.browser";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  (pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = pdfWorkerSrc as string;
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  const maxPages = Math.min(pdf.numPages, 15);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    parts.push(
      (content.items as { str?: string }[]).map((it) => it.str ?? "").join(" "),
    );
  }
  return parts.join("\n\n").replace(/\s+/g, " ").trim();
}

async function extractDocx(file: File): Promise<string> {
  const mod = mammothBrowser as unknown as {
    extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  const buf = await file.arrayBuffer();
  const r = await mod.extractRawText({ arrayBuffer: buf });
  return (r.value ?? "").replace(/\s+/g, " ").trim();
}

export async function extractCvText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") return extractPdf(file);
  if (name.endsWith(".docx") || file.type.includes("wordprocessingml")) return extractDocx(file);
  throw new Error("Formato no soportado. Usa PDF o DOCX.");
}
