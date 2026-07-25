import type { JobVacancy } from "./job-generator.functions";

export type VacancyMeta = {
  cargo: string;
  empresa: string;
  ciudad: string;
  departamento?: string;
  modalidad?: string;
  tipoContratacion?: string;
  nivel?: string;
  salario?: string;
};

const line = (s = "") => s.replace(/\s+/g, " ").trim();

export function vacancyToPlainText(meta: VacancyMeta, v: JobVacancy): string {
  const parts: string[] = [];
  parts.push(`VACANTE: ${meta.cargo}`);
  parts.push(`Empresa: ${meta.empresa}   Ciudad: ${meta.ciudad}`);
  if (meta.departamento) parts.push(`Departamento: ${meta.departamento}`);
  const l2 = [meta.modalidad, meta.tipoContratacion, meta.nivel].filter(Boolean).join(" · ");
  if (l2) parts.push(l2);
  if (meta.salario) parts.push(`Salario: ${meta.salario}`);
  parts.push("");
  parts.push("RESUMEN EJECUTIVO");
  parts.push(line(v.resumen));
  parts.push("");
  parts.push("DESCRIPCIÓN");
  parts.push(v.descripcion);
  parts.push("");
  parts.push("RESPONSABILIDADES");
  v.responsabilidades.forEach((r) => parts.push(`• ${r}`));
  parts.push("");
  parts.push("PERFIL IDEAL");
  parts.push("Debe tener:");
  v.perfil.debeTener.forEach((r) => parts.push(`  • ${r}`));
  parts.push("Deseable:");
  v.perfil.deseable.forEach((r) => parts.push(`  • ${r}`));
  parts.push("");
  parts.push("COMPETENCIAS TÉCNICAS");
  v.competencias.tecnicas.forEach((r) => parts.push(`• ${r}`));
  parts.push("COMPETENCIAS BLANDAS");
  v.competencias.blandas.forEach((r) => parts.push(`• ${r}`));
  parts.push("");
  parts.push("BENEFICIOS");
  v.beneficios.forEach((r) => parts.push(`• ${r}`));
  parts.push("");
  parts.push("KPIs");
  v.kpis.forEach((k) => parts.push(`• ${k.nombre}: ${k.meta}`));
  parts.push("");
  parts.push("PREGUNTAS STAR");
  v.preguntasStar.forEach((q, i) => parts.push(`${i + 1}. [${q.categoria}] ${q.pregunta}`));
  parts.push("");
  parts.push("PALABRAS CLAVE ATS");
  parts.push(v.palabrasAts.join(", "));
  parts.push("");
  parts.push("— Generado automáticamente por RecruitAI OS");
  return parts.join("\n");
}

function slugDate() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function slug(s: string) {
  return (s || "vacante").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}
export function vacancyFileName(cargo: string, ext: string) {
  return `Vacante_${slug(cargo)}_${slugDate()}.${ext}`;
}

export async function exportVacancyPDF(meta: VacancyMeta, v: JobVacancy) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const brandBlue: [number, number, number] = [37, 99, 235];
  const brandPurple: [number, number, number] = [124, 58, 237];
  const text: [number, number, number] = [17, 24, 39];
  const muted: [number, number, number] = [107, 114, 128];

  const ensure = (h: number) => {
    if (y + h > pageH - margin - 20) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("Generado automáticamente por RecruitAI OS", margin, pageH - 24);
    doc.text(String(doc.getCurrentPageInfo().pageNumber), pageW - margin, pageH - 24, { align: "right" });
  };

  // Header brand band
  doc.setFillColor(...brandBlue);
  doc.rect(0, 0, pageW, 8, "F");
  doc.setFillColor(...brandPurple);
  doc.rect(pageW / 2, 0, pageW / 2, 8, "F");

  // Logo circle
  doc.setFillColor(...brandBlue);
  doc.circle(margin + 12, margin + 4, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("R", margin + 12, margin + 8, { align: "center" });

  doc.setTextColor(...text);
  doc.setFontSize(14);
  doc.text("RecruitAI OS", margin + 32, margin + 2);
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.text("Descripción de vacante generada con IA", margin + 32, margin + 16);

  y = margin + 44;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...text);
  doc.setFontSize(20);
  const title = meta.cargo || "Vacante";
  const titleLines = doc.splitTextToSize(title, pageW - margin * 2);
  ensure(titleLines.length * 22);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  const meta1 = [meta.empresa, meta.ciudad, meta.departamento].filter(Boolean).join(" · ");
  const meta2 = [meta.modalidad, meta.tipoContratacion, meta.nivel, meta.salario].filter(Boolean).join(" · ");
  if (meta1) { doc.text(meta1, margin, y); y += 14; }
  if (meta2) { doc.text(meta2, margin, y); y += 14; }
  y += 6;

  const heading = (t: string) => {
    ensure(28);
    doc.setDrawColor(...brandBlue);
    doc.setLineWidth(2);
    doc.line(margin, y + 2, margin + 24, y + 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...brandBlue);
    doc.text(t.toUpperCase(), margin + 32, y + 6);
    y += 22;
  };
  const paragraph = (t: string) => {
    if (!t) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...text);
    const lines = doc.splitTextToSize(t, pageW - margin * 2);
    lines.forEach((l: string) => { ensure(14); doc.text(l, margin, y); y += 14; });
    y += 4;
  };
  const bullets = (items: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...text);
    items.forEach((it) => {
      const lines = doc.splitTextToSize(it, pageW - margin * 2 - 14);
      ensure(lines.length * 14);
      doc.setTextColor(...brandBlue);
      doc.text("•", margin, y);
      doc.setTextColor(...text);
      doc.text(lines, margin + 12, y);
      y += lines.length * 14;
    });
    y += 4;
  };

  heading("Descripción");
  paragraph(v.descripcion || v.resumen || "—");

  heading("Perfil ideal");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(...text);
  ensure(14); doc.text("Debe tener", margin, y); y += 14;
  bullets(v.perfil.debeTener.length ? v.perfil.debeTener : ["—"]);
  doc.setFont("helvetica", "bold"); ensure(14); doc.text("Deseable", margin, y); y += 14;
  bullets(v.perfil.deseable.length ? v.perfil.deseable : ["—"]);

  heading("Responsabilidades");
  bullets(v.responsabilidades.length ? v.responsabilidades : ["—"]);

  heading("Competencias");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(...text);
  ensure(14); doc.text("Técnicas", margin, y); y += 14;
  bullets(v.competencias.tecnicas.length ? v.competencias.tecnicas : ["—"]);
  doc.setFont("helvetica", "bold"); ensure(14); doc.text("Blandas", margin, y); y += 14;
  bullets(v.competencias.blandas.length ? v.competencias.blandas : ["—"]);

  heading("Beneficios");
  bullets(v.beneficios.length ? v.beneficios : ["—"]);

  heading("KPIs");
  bullets(v.kpis.length ? v.kpis.map((k) => `${k.nombre}: ${k.meta}`) : ["—"]);

  heading("Preguntas STAR");
  bullets(v.preguntasStar.length ? v.preguntasStar.map((q, i) => `${i + 1}. [${q.categoria}] ${q.pregunta}`) : ["—"]);

  heading("Palabras clave ATS");
  paragraph(v.palabrasAts.length ? v.palabrasAts.join(", ") : "—");

  addFooter();
  doc.save(vacancyFileName(meta.cargo, "pdf"));
}

export async function exportVacancyDOCX(meta: VacancyMeta, v: JobVacancy) {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber,
    LevelFormat, BorderStyle,
  } = await import("docx");
  const saveAsMod = await import("file-saver");
  const saveAs = saveAsMod.saveAs || saveAsMod.default;

  const brand = "2563EB";
  const purple = "7C3AED";

  const h = (text: string) => new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    border: { bottom: { color: brand, size: 8, space: 2, style: BorderStyle.SINGLE } },
    children: [new TextRun({ text, bold: true, color: brand, size: 28 })],
  });
  const h2 = (text: string) => new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, color: purple, size: 22 })],
  });
  const p = (text: string) => new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 22 })],
  });
  const bullet = (text: string) => new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, size: 22 })],
  });

  const children: (typeof Paragraph.prototype)[] = [];
  // Header
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text: "RecruitAI OS", bold: true, color: brand, size: 32 })],
  }));
  children.push(new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text: "Descripción de vacante generada con IA", color: "6B7280", size: 20 })],
  }));

  children.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    spacing: { after: 120 },
    children: [new TextRun({ text: meta.cargo || "Vacante", bold: true, size: 44 })],
  }));
  const meta1 = [meta.empresa, meta.ciudad, meta.departamento].filter(Boolean).join(" · ");
  const meta2 = [meta.modalidad, meta.tipoContratacion, meta.nivel, meta.salario].filter(Boolean).join(" · ");
  if (meta1) children.push(p(meta1));
  if (meta2) children.push(p(meta2));

  children.push(h("Resumen ejecutivo"));
  children.push(p(v.resumen || "—"));

  children.push(h("Descripción"));
  (v.descripcion || "—").split(/\n\n+/).forEach((par) => children.push(p(par)));

  children.push(h("Responsabilidades"));
  (v.responsabilidades.length ? v.responsabilidades : ["—"]).forEach((r) => children.push(bullet(r)));

  children.push(h("Perfil ideal"));
  children.push(h2("Debe tener"));
  (v.perfil.debeTener.length ? v.perfil.debeTener : ["—"]).forEach((r) => children.push(bullet(r)));
  children.push(h2("Deseable"));
  (v.perfil.deseable.length ? v.perfil.deseable : ["—"]).forEach((r) => children.push(bullet(r)));

  children.push(h("Competencias"));
  children.push(h2("Técnicas"));
  (v.competencias.tecnicas.length ? v.competencias.tecnicas : ["—"]).forEach((r) => children.push(bullet(r)));
  children.push(h2("Blandas"));
  (v.competencias.blandas.length ? v.competencias.blandas : ["—"]).forEach((r) => children.push(bullet(r)));

  children.push(h("Beneficios"));
  (v.beneficios.length ? v.beneficios : ["—"]).forEach((r) => children.push(bullet(r)));

  children.push(h("KPIs"));
  (v.kpis.length ? v.kpis : [{ nombre: "—", meta: "" }]).forEach((k) =>
    children.push(bullet(`${k.nombre}${k.meta ? `: ${k.meta}` : ""}`)),
  );

  children.push(h("Preguntas STAR"));
  (v.preguntasStar.length ? v.preguntasStar : [{ categoria: "—", pregunta: "" }]).forEach((q, i) =>
    children.push(bullet(`${i + 1}. [${q.categoria}] ${q.pregunta}`)),
  );

  children.push(h("Palabras clave ATS"));
  children.push(p(v.palabrasAts.length ? v.palabrasAts.join(", ") : "—"));

  const doc = new Document({
    creator: "RecruitAI OS",
    title: `Vacante ${meta.cargo}`,
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } },
        }],
      }],
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
  saveAs(blob, vacancyFileName(meta.cargo, "docx"));
}
