export type EvaluationExport = {
  candidato: string;
  archivo: string;
  cargoActual?: string;
  empresaActual?: string;
  vacante: string;
  empresa: string;
  ciudad: string;
  compatibilidad: number;
  recomendacion: string;
  resumen: string;
  fortalezas: string[];
  riesgos: string[];
  competenciasTecnicas: { nombre: string; nivel: number }[];
  competenciasBlandas: string[];
  experiencia: string[];
  educacion: string[];
  idiomas: string[];
  certificaciones: string[];
  brechas: string[];
  preguntasStar: string[];
  justificacion: string;
};

function slug(s: string) {
  return (s || "evaluacion").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function slugDate() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
export function evaluationFileName(name: string, ext: string) {
  return `Evaluacion_${slug(name)}_${slugDate()}.${ext}`;
}

export function evaluationToText(e: EvaluationExport): string {
  const p: string[] = [];
  p.push(`EVALUACIÓN DE CANDIDATO`);
  p.push(`Candidato: ${e.candidato}`);
  if (e.cargoActual) p.push(`Cargo actual: ${e.cargoActual}${e.empresaActual ? ` — ${e.empresaActual}` : ""}`);
  p.push(`Vacante: ${e.vacante} · ${e.empresa} · ${e.ciudad}`);
  p.push(`Compatibilidad: ${e.compatibilidad}%   Recomendación: ${e.recomendacion}`);
  p.push("");
  p.push("RESUMEN EJECUTIVO"); p.push(e.resumen); p.push("");
  p.push("FORTALEZAS"); e.fortalezas.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("RIESGOS"); e.riesgos.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("COMPETENCIAS TÉCNICAS"); e.competenciasTecnicas.forEach((x) => p.push(`• ${x.nombre} — ${x.nivel}%`)); p.push("");
  p.push("COMPETENCIAS BLANDAS"); e.competenciasBlandas.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("EXPERIENCIA"); e.experiencia.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("EDUCACIÓN"); e.educacion.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("IDIOMAS"); p.push(e.idiomas.join(", ")); p.push("");
  p.push("CERTIFICACIONES"); e.certificaciones.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("BRECHAS RESPECTO A LA VACANTE"); e.brechas.forEach((x) => p.push(`• ${x}`)); p.push("");
  p.push("PREGUNTAS STAR SUGERIDAS"); e.preguntasStar.forEach((x, i) => p.push(`${i + 1}. ${x}`)); p.push("");
  p.push("JUSTIFICACIÓN DE LA RECOMENDACIÓN"); p.push(e.justificacion);
  p.push(""); p.push("— Generado automáticamente por RecruitAI OS");
  return p.join("\n");
}

export async function exportEvaluationPDF(e: EvaluationExport) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48; let y = margin;
  const brandBlue: [number, number, number] = [37, 99, 235];
  const brandPurple: [number, number, number] = [124, 58, 237];
  const text: [number, number, number] = [17, 24, 39];
  const muted: [number, number, number] = [107, 114, 128];
  const ensure = (h: number) => { if (y + h > pageH - margin - 20) { footer(); doc.addPage(); y = margin; } };
  const footer = () => {
    doc.setFontSize(8); doc.setTextColor(...muted);
    doc.text("Generado automáticamente por RecruitAI OS", margin, pageH - 24);
    doc.text(String(doc.getCurrentPageInfo().pageNumber), pageW - margin, pageH - 24, { align: "right" });
  };
  doc.setFillColor(...brandBlue); doc.rect(0, 0, pageW, 8, "F");
  doc.setFillColor(...brandPurple); doc.rect(pageW / 2, 0, pageW / 2, 8, "F");
  doc.setFillColor(...brandBlue); doc.circle(margin + 12, margin + 4, 12, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
  doc.text("R", margin + 12, margin + 8, { align: "center" });
  doc.setTextColor(...text); doc.setFontSize(14); doc.text("RecruitAI OS", margin + 32, margin + 2);
  doc.setFontSize(9); doc.setTextColor(...muted); doc.setFont("helvetica", "normal");
  doc.text("Evaluación de candidato generada con IA", margin + 32, margin + 16);
  y = margin + 44;
  doc.setFont("helvetica", "bold"); doc.setTextColor(...text); doc.setFontSize(20);
  const titleLines = doc.splitTextToSize(e.candidato, pageW - margin * 2);
  ensure(titleLines.length * 22); doc.text(titleLines, margin, y); y += titleLines.length * 22 + 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...muted);
  const meta1 = [e.cargoActual, e.empresaActual].filter(Boolean).join(" · ");
  const meta2 = `Vacante: ${e.vacante} · ${e.empresa} · ${e.ciudad}`;
  const meta3 = `Compatibilidad: ${e.compatibilidad}%   ·   Recomendación: ${e.recomendacion}`;
  if (meta1) { doc.text(meta1, margin, y); y += 14; }
  doc.text(meta2, margin, y); y += 14;
  doc.setTextColor(...brandBlue); doc.setFont("helvetica", "bold"); doc.text(meta3, margin, y); y += 20;

  const heading = (t: string) => {
    ensure(28); doc.setDrawColor(...brandBlue); doc.setLineWidth(2);
    doc.line(margin, y + 2, margin + 24, y + 2);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...brandBlue);
    doc.text(t.toUpperCase(), margin + 32, y + 6); y += 22;
  };
  const paragraph = (t: string) => {
    if (!t) return;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(...text);
    const lines = doc.splitTextToSize(t, pageW - margin * 2);
    lines.forEach((l: string) => { ensure(14); doc.text(l, margin, y); y += 14; });
    y += 4;
  };
  const bullets = (items: string[]) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(...text);
    items.forEach((it) => {
      const lines = doc.splitTextToSize(it, pageW - margin * 2 - 14);
      ensure(lines.length * 14);
      doc.setTextColor(...brandBlue); doc.text("•", margin, y);
      doc.setTextColor(...text); doc.text(lines, margin + 12, y);
      y += lines.length * 14;
    });
    y += 4;
  };

  heading("Resumen ejecutivo"); paragraph(e.resumen);
  heading("Fortalezas"); bullets(e.fortalezas.length ? e.fortalezas : ["—"]);
  heading("Riesgos"); bullets(e.riesgos.length ? e.riesgos : ["—"]);
  heading("Competencias técnicas");
  bullets(e.competenciasTecnicas.length ? e.competenciasTecnicas.map((x) => `${x.nombre} — ${x.nivel}%`) : ["—"]);
  heading("Competencias blandas"); bullets(e.competenciasBlandas.length ? e.competenciasBlandas : ["—"]);
  heading("Experiencia"); bullets(e.experiencia.length ? e.experiencia : ["—"]);
  heading("Educación"); bullets(e.educacion.length ? e.educacion : ["—"]);
  heading("Idiomas"); paragraph(e.idiomas.length ? e.idiomas.join(", ") : "—");
  heading("Certificaciones"); bullets(e.certificaciones.length ? e.certificaciones : ["—"]);
  heading("Brechas respecto a la vacante"); bullets(e.brechas.length ? e.brechas : ["—"]);
  heading("Preguntas STAR sugeridas");
  bullets(e.preguntasStar.length ? e.preguntasStar.map((q, i) => `${i + 1}. ${q}`) : ["—"]);
  heading("Justificación de la recomendación"); paragraph(e.justificacion);
  footer();
  doc.save(evaluationFileName(e.candidato, "pdf"));
}

export async function exportEvaluationDOCX(e: EvaluationExport) {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber,
    LevelFormat, BorderStyle,
  } = await import("docx");
  const saveAsMod = await import("file-saver");
  const saveAs = saveAsMod.saveAs || saveAsMod.default;
  const brand = "2563EB"; const purple = "7C3AED";
  const h = (t: string) => new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 },
    border: { bottom: { color: brand, size: 8, space: 2, style: BorderStyle.SINGLE } },
    children: [new TextRun({ text: t, bold: true, color: brand, size: 28 })],
  });
  const h2 = (t: string) => new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 },
    children: [new TextRun({ text: t, bold: true, color: purple, size: 22 })],
  });
  const p = (t: string) => new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: t, size: 22 })] });
  const bullet = (t: string) => new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text: t, size: 22 })],
  });
  const children: (typeof Paragraph.prototype)[] = [];
  children.push(new Paragraph({ children: [new TextRun({ text: "RecruitAI OS", bold: true, color: brand, size: 32 })] }));
  children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Evaluación de candidato generada con IA", color: "6B7280", size: 20 })] }));
  children.push(new Paragraph({ heading: HeadingLevel.TITLE, spacing: { after: 120 }, children: [new TextRun({ text: e.candidato, bold: true, size: 44 })] }));
  const meta1 = [e.cargoActual, e.empresaActual].filter(Boolean).join(" · ");
  if (meta1) children.push(p(meta1));
  children.push(p(`Vacante: ${e.vacante} · ${e.empresa} · ${e.ciudad}`));
  children.push(new Paragraph({ children: [new TextRun({ text: `Compatibilidad: ${e.compatibilidad}%   ·   Recomendación: ${e.recomendacion}`, bold: true, color: brand, size: 24 })] }));

  children.push(h("Resumen ejecutivo")); children.push(p(e.resumen || "—"));
  children.push(h("Fortalezas")); (e.fortalezas.length ? e.fortalezas : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Riesgos")); (e.riesgos.length ? e.riesgos : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Competencias"));
  children.push(h2("Técnicas"));
  (e.competenciasTecnicas.length ? e.competenciasTecnicas : [{ nombre: "—", nivel: 0 }]).forEach((x) => children.push(bullet(`${x.nombre}${x.nivel ? ` — ${x.nivel}%` : ""}`)));
  children.push(h2("Blandas")); (e.competenciasBlandas.length ? e.competenciasBlandas : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Experiencia")); (e.experiencia.length ? e.experiencia : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Educación")); (e.educacion.length ? e.educacion : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Idiomas")); children.push(p(e.idiomas.length ? e.idiomas.join(", ") : "—"));
  children.push(h("Certificaciones")); (e.certificaciones.length ? e.certificaciones : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Brechas respecto a la vacante")); (e.brechas.length ? e.brechas : ["—"]).forEach((x) => children.push(bullet(x)));
  children.push(h("Preguntas STAR sugeridas"));
  (e.preguntasStar.length ? e.preguntasStar : ["—"]).forEach((q, i) => children.push(bullet(`${i + 1}. ${q}`)));
  children.push(h("Justificación de la recomendación")); children.push(p(e.justificacion || "—"));

  const doc = new Document({
    creator: "RecruitAI OS",
    title: `Evaluación ${e.candidato}`,
    numbering: {
      config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }],
    },
    sections: [{
      properties: { page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Generado automáticamente por RecruitAI OS · Página ", size: 18, color: "6B7280" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "6B7280" }),
            ],
          })],
        }),
      },
      children,
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, evaluationFileName(e.candidato, "docx"));
}
