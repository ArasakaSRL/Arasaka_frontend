import { jsPDF } from "jspdf";
import type {
  Usuario,
  Proyectos,
  HabilidadTecnica,
  HabilidadBlanda,
  experiencias as Experiencia,
  certificaciones as Certificacion,
} from "../types/portafolioType";

type CVData = {
  usuario: Usuario;
  proyectos: Proyectos[];
  tecnicas: HabilidadTecnica[];
  blandas: HabilidadBlanda[];
  experiencias: Experiencia[];
  certificaciones: Certificacion[];
};

// Colores
const NAVY: [number, number, number] = [10, 17, 32];
const NAVY_SOFT: [number, number, number] = [26, 35, 56];
const ACCENT: [number, number, number] = [59, 130, 246];
const TEXT_DARK: [number, number, number] = [17, 24, 39];
const TEXT_MUTED: [number, number, number] = [90, 102, 122];
const TEXT_LIGHT: [number, number, number] = [220, 228, 240];
const TEXT_LIGHT_MUTED: [number, number, number] = [160, 175, 195];
const DIVIDER_LIGHT: [number, number, number] = [70, 85, 110];

// Layout
const SIDEBAR_W = 190;
const PAGE_PAD = 28;
const MAIN_PAD_X = 28;
const MAIN_TOP = 50;
const LINE_GAP = 13;

function blobToObjectUrlImage(blob: Blob): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const objUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(null);
    };
    img.src = objUrl;
  });
}

function imgToJpegDataUrl(img: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement("canvas");
    const size = Math.max(img.naturalWidth, img.naturalHeight, 1);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    const offX = (size - img.naturalWidth) / 2;
    const offY = (size - img.naturalHeight) / 2;
    ctx.drawImage(img, offX, offY);
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch (e) {
    console.warn("[CV] canvas tainted:", e);
    return null;
  }
}

async function fetchBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob || blob.size === 0) return null;
    return blob;
  } catch (e) {
    console.warn("[CV] fetch falló:", url, e);
    return null;
  }
}

function blobToBase64DataUrl(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onloadend = () => resolve((r.result as string) || null);
    r.onerror = () => resolve(null);
    r.readAsDataURL(blob);
  });
}

async function tryUrl(url: string, label: string): Promise<string | null> {
  console.log(`[CV] intentando (${label}):`, url);
  const blob = await fetchBlob(url);
  if (!blob) {
    console.warn(`[CV] (${label}) fetch sin blob`);
    return null;
  }
  console.log(`[CV] (${label}) blob OK`, blob.type, blob.size, "bytes");

  // Camino A: base64 directo (rápido, conserva el formato original)
  const dataUrl = await blobToBase64DataUrl(blob);
  if (dataUrl && dataUrl.startsWith("data:image/")) {
    console.log(`[CV] (${label}) dataURL listo`);
    return dataUrl;
  }

  // Camino B: pasar por canvas para normalizar a JPEG
  const img = await blobToObjectUrlImage(blob);
  if (!img) {
    console.warn(`[CV] (${label}) image no decodificó`);
    return null;
  }
  const jpeg = imgToJpegDataUrl(img);
  if (jpeg) console.log(`[CV] (${label}) canvas → JPEG OK`);
  return jpeg;
}

function clipImageToCircle(dataUrl: string, size: number): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.fillStyle = `rgb(${NAVY[0]}, ${NAVY[1]}, ${NAVY[2]})`;
      ctx.fillRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  console.log("[CV] cargando foto de perfil:", url);

  // 1) Proxy propio del backend (saltea CORS de Firebase de forma confiable)
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
  const backendProxy = `${apiBase}/api/public/image-proxy?url=${encodeURIComponent(url)}`;
  let result = await tryUrl(backendProxy, "backend-proxy");
  if (result) return result;

  // 2) Directo (por si el bucket tiene CORS configurado)
  result = await tryUrl(url, "directo");
  if (result) return result;

  // 3) Proxies CORS públicos como último recurso
  const proxies: Array<[string, string]> = [
    ["corsproxy", `https://corsproxy.io/?${encodeURIComponent(url)}`],
    ["allorigins", `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`],
    ["weserv", `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ""))}`],
  ];
  for (const [name, proxied] of proxies) {
    result = await tryUrl(proxied, name);
    if (result) return result;
  }

  console.warn("[CV] no se pudo cargar la foto:", url);
  return null;
}

function formatDate(s: string | null): string {
  if (!s) return "Actualidad";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

export async function generateCV(data: CVData): Promise<void> {
  const { usuario, proyectos, tecnicas, blandas, experiencias, certificaciones } = data;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const mainX = SIDEBAR_W + MAIN_PAD_X;
  const mainW = pageW - SIDEBAR_W - MAIN_PAD_X * 2;

  let mainY = MAIN_TOP;

  const rawPhotoDataUrl = usuario.foto_perfil ? await loadImageAsDataUrl(usuario.foto_perfil) : null;
  const photoDataUrl = rawPhotoDataUrl ? await clipImageToCircle(rawPhotoDataUrl, 110) : null;

  // ===== Helpers =====
  const drawSidebarBg = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, SIDEBAR_W, pageH, "F");
    // Acento lateral
    doc.setFillColor(...ACCENT);
    doc.rect(SIDEBAR_W, 0, 3, pageH, "F");
  };

  const ensureMainSpace = (needed: number) => {
    if (mainY + needed > pageH - PAGE_PAD) {
      doc.addPage();
      drawSidebarBg();
      mainY = MAIN_TOP;
    }
  };

  const setText = (color: [number, number, number], size: number, weight: "normal" | "bold" | "italic" = "normal") => {
    doc.setTextColor(...color);
    doc.setFontSize(size);
    doc.setFont("helvetica", weight);
  };

  const drawSectionHeader = (title: string) => {
    ensureMainSpace(34);
    mainY += 4;
    setText(NAVY, 12, "bold");
    doc.text(title.toUpperCase(), mainX, mainY);
    // subrayado
    const w = doc.getTextWidth(title.toUpperCase());
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(1.4);
    doc.line(mainX, mainY + 4, mainX + w, mainY + 4);
    // línea suave que cruza
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.6);
    doc.line(mainX + w + 8, mainY + 4, mainX + mainW, mainY + 4);
    mainY += 18;
  };

  const drawMainParagraph = (text: string, color: [number, number, number] = TEXT_MUTED, size = 9.5) => {
    if (!text) return;
    setText(color, size, "normal");
    const lines = doc.splitTextToSize(text, mainW);
    for (const line of lines) {
      ensureMainSpace(LINE_GAP);
      doc.text(line, mainX, mainY);
      mainY += LINE_GAP;
    }
  };

  // ===== Sidebar (página 1) =====
  drawSidebarBg();

  // Foto circular
  const photoSize = 110;
  const photoX = (SIDEBAR_W - photoSize) / 2;
  const photoY = 50;

  // Anillo decorativo
  doc.setFillColor(...NAVY_SOFT);
  doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 6, "F");

  let fotoOk = false;
  if (photoDataUrl) {
    try {
      console.log("[CV] insertando foto circular en PDF");
      doc.addImage(photoDataUrl, "PNG", photoX, photoY, photoSize, photoSize, undefined, "FAST");
      fotoOk = true;
      console.log("[CV] foto insertada OK");
    } catch (e) {
      console.error("[CV] addImage falló:", e);
      fotoOk = false;
    }
  } else {
    console.warn("[CV] photoDataUrl es null. usuario.foto_perfil =", usuario.foto_perfil);
  }

  if (!fotoOk) {
    const initials = `${usuario.nombre?.[0] ?? ""}${usuario.apellido?.[0] ?? ""}`.toUpperCase();
    doc.setFillColor(...ACCENT);
    doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "F");
    setText([255, 255, 255], 36, "bold");
    const tw = doc.getTextWidth(initials);
    doc.text(initials, photoX + (photoSize - tw) / 2, photoY + photoSize / 2 + 12);
  }

  // Borde circular (acento)
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "S");

  let sideY = photoY + photoSize + 30;

  // Nombre
  setText([255, 255, 255], 16, "bold");
  const nameLines = doc.splitTextToSize(`${usuario.nombre} ${usuario.apellido}`, SIDEBAR_W - 24);
  for (const line of nameLines) {
    const tw = doc.getTextWidth(line);
    doc.text(line, (SIDEBAR_W - tw) / 2, sideY);
    sideY += 18;
  }

  // Profesión
  const profesion = usuario.profesiones?.[0]?.nombre;
  if (profesion) {
    setText(TEXT_LIGHT_MUTED, 9, "italic");
    const lines = doc.splitTextToSize(profesion, SIDEBAR_W - 24);
    for (const line of lines) {
      const tw = doc.getTextWidth(line);
      doc.text(line, (SIDEBAR_W - tw) / 2, sideY);
      sideY += 12;
    }
  }

  sideY += 14;

  const drawSidebarTitle = (title: string) => {
    setText([255, 255, 255], 10, "bold");
    doc.text(title.toUpperCase(), 18, sideY);
    sideY += 4;
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(1.2);
    doc.line(18, sideY, 18 + 22, sideY);
    doc.setDrawColor(...DIVIDER_LIGHT);
    doc.setLineWidth(0.4);
    doc.line(18 + 26, sideY, SIDEBAR_W - 18, sideY);
    sideY += 12;
  };

  const drawSidebarItem = (label: string, value: string) => {
    if (!value) return;
    setText(TEXT_LIGHT_MUTED, 7.5, "bold");
    doc.text(label.toUpperCase(), 18, sideY);
    sideY += 10;
    setText(TEXT_LIGHT, 8.5, "normal");
    const lines = doc.splitTextToSize(value, SIDEBAR_W - 36);
    for (const line of lines) {
      doc.text(line, 18, sideY);
      sideY += 11;
    }
    sideY += 5;
  };

  // Contacto
  const hasContact = usuario.correo || usuario.telefonos?.[0]?.numero || usuario.pais;
  if (hasContact) {
    drawSidebarTitle("Contacto");
    if (usuario.correo) drawSidebarItem("Email", usuario.correo);
    if (usuario.telefonos?.[0]?.numero) drawSidebarItem("Teléfono", usuario.telefonos[0].numero);
    if (usuario.pais) drawSidebarItem("Ubicación", usuario.pais);
    sideY += 6;
  }

  // Idiomas
  if (usuario.idiomas?.length) {
    drawSidebarTitle("Idiomas");
    setText(TEXT_LIGHT, 8.5, "normal");
    for (const idioma of usuario.idiomas) {
      doc.text(`•  ${idioma}`, 18, sideY);
      sideY += 12;
    }
    sideY += 6;
  }

  // Habilidades blandas
  if (blandas?.length) {
    drawSidebarTitle("Habilidades Blandas");
    for (const b of blandas) {
      if (!b.nombre) continue;
      setText(TEXT_LIGHT, 8.5, "bold");
      doc.text(b.nombre, 18, sideY);
      sideY += 10;
      if (b.nivel) {
        setText(TEXT_LIGHT_MUTED, 7.5, "italic");
        doc.text(`Nivel: ${b.nivel}`, 18, sideY);
        sideY += 10;
      }
      sideY += 4;
    }
  }

  // ===== Main: Encabezado superior con franja =====
  // banda superior decorativa
  doc.setFillColor(245, 248, 252);
  doc.rect(SIDEBAR_W + 3, 0, pageW - SIDEBAR_W - 3, 30, "F");

  setText(NAVY, 9, "bold");
  doc.text("CURRICULUM VITAE", mainX, 19);
  setText(ACCENT, 9, "normal");
  const today = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const todayW = doc.getTextWidth(today);
  doc.text(today, pageW - MAIN_PAD_X - todayW, 19);

  mainY = MAIN_TOP;

  // ===== Perfil =====
  if (usuario.biografia) {
    drawSectionHeader("Perfil");
    drawMainParagraph(usuario.biografia, TEXT_DARK, 10);
    mainY += 6;
  }

  // ===== Experiencias =====
  if (experiencias?.length) {
    drawSectionHeader("Experiencia");
    for (const exp of experiencias) {
      ensureMainSpace(LINE_GAP * 3 + 6);

      // bullet point
      doc.setFillColor(...ACCENT);
      doc.circle(mainX + 2, mainY - 3, 2.2, "F");

      setText(NAVY, 11, "bold");
      doc.text(exp.cargo, mainX + 12, mainY);

      // periodo a la derecha
      const periodo = `${formatDate(exp.fecha_inicio)} — ${formatDate(exp.fecha_fin)}`;
      setText(ACCENT, 8.5, "bold");
      const pw = doc.getTextWidth(periodo);
      doc.text(periodo, mainX + mainW - pw, mainY);
      mainY += LINE_GAP;

      setText(TEXT_MUTED, 9.5, "italic");
      doc.text(exp.Nombre_empresa, mainX + 12, mainY);
      mainY += LINE_GAP;

      if (exp.descripcion) {
        setText(TEXT_DARK, 9.5, "normal");
        const lines = doc.splitTextToSize(exp.descripcion, mainW - 12);
        for (const line of lines) {
          ensureMainSpace(LINE_GAP);
          doc.text(line, mainX + 12, mainY);
          mainY += LINE_GAP;
        }
      }
      mainY += 8;
    }
  }

  // ===== Proyectos =====
  if (proyectos?.length) {
    drawSectionHeader("Proyectos");
    for (const proy of proyectos) {
      ensureMainSpace(LINE_GAP * 3 + 6);

      doc.setFillColor(...ACCENT);
      doc.circle(mainX + 2, mainY - 3, 2.2, "F");

      setText(NAVY, 11, "bold");
      doc.text(proy.nombre, mainX + 12, mainY);
      mainY += LINE_GAP;

      const techs = proy.tecnologias?.map((t) => t.nombre).filter(Boolean).join(" • ");
      if (techs) {
        setText(ACCENT, 8.5, "bold");
        const tlines = doc.splitTextToSize(techs, mainW - 12);
        for (const line of tlines) {
          ensureMainSpace(LINE_GAP);
          doc.text(line, mainX + 12, mainY);
          mainY += LINE_GAP;
        }
      }

      if (proy.descripcion) {
        setText(TEXT_DARK, 9.5, "normal");
        const lines = doc.splitTextToSize(proy.descripcion, mainW - 12);
        for (const line of lines) {
          ensureMainSpace(LINE_GAP);
          doc.text(line, mainX + 12, mainY);
          mainY += LINE_GAP;
        }
      }
      mainY += 8;
    }
  }

  // ===== Habilidades técnicas (chips) =====
  if (tecnicas?.length) {
    drawSectionHeader("Habilidades Técnicas");
    const tags = tecnicas
      .flatMap((g) => g.tecnologias?.map((t) => t.nombre) ?? [])
      .filter((s): s is string => Boolean(s));

    let cx = mainX;
    let cy = mainY;
    const padX = 8;
    const padY = 4;
    const gap = 6;
    const chipH = 18;

    setText(ACCENT, 9, "bold");
    for (const tag of tags) {
      const tw = doc.getTextWidth(tag);
      const chipW = tw + padX * 2;
      if (cx + chipW > mainX + mainW) {
        cx = mainX;
        cy += chipH + gap;
      }
      if (cy + chipH > pageH - PAGE_PAD) {
        doc.addPage();
        drawSidebarBg();
        mainY = MAIN_TOP;
        cy = mainY;
      }
      doc.setDrawColor(...ACCENT);
      doc.setFillColor(235, 244, 255);
      doc.setLineWidth(0.6);
      doc.roundedRect(cx, cy - chipH + padY + 2, chipW, chipH, 4, 4, "FD");
      setText(ACCENT, 9, "bold");
      doc.text(tag, cx + padX, cy);
      cx += chipW + gap;
    }
    mainY = cy + chipH;
  }

  // ===== Certificaciones =====
  if (certificaciones?.length) {
    drawSectionHeader("Certificaciones");
    for (const cert of certificaciones) {
      ensureMainSpace(LINE_GAP * 3 + 6);

      doc.setFillColor(...ACCENT);
      doc.circle(mainX + 2, mainY - 3, 2.2, "F");

      setText(NAVY, 11, "bold");
      doc.text(cert.titulo, mainX + 12, mainY);

      setText(ACCENT, 8.5, "bold");
      const fecha = formatDate(cert.fecha_emision);
      const fw = doc.getTextWidth(fecha);
      doc.text(fecha, mainX + mainW - fw, mainY);
      mainY += LINE_GAP;

      if (cert.institucion) {
        setText(TEXT_MUTED, 9.5, "italic");
        doc.text(cert.institucion, mainX + 12, mainY);
        mainY += LINE_GAP;
      }

      if (cert.descripcion) {
        setText(TEXT_DARK, 9.5, "normal");
        const lines = doc.splitTextToSize(cert.descripcion, mainW - 12);
        for (const line of lines) {
          ensureMainSpace(LINE_GAP);
          doc.text(line, mainX + 12, mainY);
          mainY += LINE_GAP;
        }
      }
      mainY += 8;
    }
  }

  // Footer en cada página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setText(TEXT_LIGHT_MUTED, 7.5, "normal");
    doc.text(`${usuario.nombre} ${usuario.apellido}`, 18, pageH - 16);
    setText(TEXT_MUTED, 7.5, "normal");
    const pageLabel = `Página ${i} de ${pageCount}`;
    const plw = doc.getTextWidth(pageLabel);
    doc.text(pageLabel, pageW - MAIN_PAD_X - plw, pageH - 16);
  }

  const sanitize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");

  const filename = `CV_${sanitize(usuario.nombre)}_${sanitize(usuario.apellido)}.pdf`;
  doc.save(filename);
}
