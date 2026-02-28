import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Vehicle } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/locale";

type DealerInfo = {
  business_name?: string | null;
  address?: string | null;
  phone?: string | null;
};

type PdfOptions = {
  locale?: Locale;
};

type PdfContext = {
  page: PDFPage;
  y: number;
};

const PAGE_SIZE: [number, number] = [612, 792]; // US Letter
const MARGIN = 40;
const SECTION_GAP = 16;
const GOLD = rgb(0.78, 0.65, 0.37);
const SOFT_BLACK = rgb(0.12, 0.12, 0.12);
const SOFT_GRAY = rgb(0.35, 0.35, 0.35);

type PdfLabels = {
  na: string;
  yes: string;
  no: string;
  callForPrice: string;
  generated: string;
  status: string;
  price: string;
  vehicleInformation: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  vin: string;
  color: string;
  drivetrain: string;
  transmission: string;
  fuelType: string;
  featured: string;
  published: string;
  created: string;
  updated: string;
  highlights: string;
  description: string;
  additionalSpecs: string;
};

const PDF_LABELS: Record<Locale, PdfLabels> = {
  en: {
    na: "N/A",
    yes: "Yes",
    no: "No",
    callForPrice: "Call for Price",
    generated: "Generated",
    status: "Status",
    price: "Price",
    vehicleInformation: "Vehicle Information",
    year: "Year",
    make: "Make",
    model: "Model",
    trim: "Trim",
    mileage: "Mileage",
    vin: "VIN",
    color: "Color",
    drivetrain: "Drivetrain",
    transmission: "Transmission",
    fuelType: "Fuel Type",
    featured: "Featured",
    published: "Published",
    created: "Created",
    updated: "Updated",
    highlights: "Highlights",
    description: "Description",
    additionalSpecs: "Additional Specs"
  },
  es: {
    na: "N/D",
    yes: "Sí",
    no: "No",
    callForPrice: "Llamar para precio",
    generated: "Generado",
    status: "Estado",
    price: "Precio",
    vehicleInformation: "Información del vehículo",
    year: "Año",
    make: "Marca",
    model: "Modelo",
    trim: "Versión",
    mileage: "Millaje",
    vin: "VIN",
    color: "Color",
    drivetrain: "Tracción",
    transmission: "Transmisión",
    fuelType: "Combustible",
    featured: "Destacado",
    published: "Publicado",
    created: "Creado",
    updated: "Actualizado",
    highlights: "Destacados",
    description: "Descripción",
    additionalSpecs: "Especificaciones adicionales"
  }
};

const STATUS_TEXT: Record<Locale, Record<Vehicle["status"], string>> = {
  en: {
    available: "AVAILABLE",
    pending: "PENDING",
    sold: "SOLD"
  },
  es: {
    available: "DISPONIBLE",
    pending: "PENDIENTE",
    sold: "VENDIDO"
  }
};

function toIntlLocale(locale: Locale) {
  return locale === "es" ? "es-US" : "en-US";
}

function normalizeValue(value: string | number | boolean | null | undefined, labels: PdfLabels) {
  if (value == null || value === "") return labels.na;
  if (typeof value === "boolean") return value ? labels.yes : labels.no;
  return String(value);
}

function normalizeSpecValue(value: unknown, labels: PdfLabels) {
  if (value == null || value === "") return labels.na;
  if (typeof value === "boolean") return value ? labels.yes : labels.no;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatPrice(price: number | null | undefined, labels: PdfLabels, locale: Locale) {
  if (price == null) return labels.callForPrice;
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function formatMileage(mileage: number | null | undefined, labels: PdfLabels, locale: Locale) {
  if (mileage == null) return labels.na;
  return `${new Intl.NumberFormat(toIntlLocale(locale)).format(mileage)} mi`;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);
    if (candidateWidth <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function embedImageFromUrl(pdf: PDFDocument, imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const bytes = new Uint8Array(await response.arrayBuffer());

    if (contentType.includes("png") || imageUrl.toLowerCase().endsWith(".png")) {
      return pdf.embedPng(bytes);
    }

    if (
      contentType.includes("jpg") ||
      contentType.includes("jpeg") ||
      imageUrl.toLowerCase().endsWith(".jpg") ||
      imageUrl.toLowerCase().endsWith(".jpeg")
    ) {
      return pdf.embedJpg(bytes);
    }

    return null;
  } catch {
    return null;
  }
}

function ensureSpace(pdf: PDFDocument, ctx: PdfContext, neededHeight: number) {
  if (ctx.y - neededHeight < MARGIN) {
    ctx.page = pdf.addPage(PAGE_SIZE);
    ctx.y = PAGE_SIZE[1] - MARGIN;
  }
}

function drawSectionTitle(pdf: PDFDocument, ctx: PdfContext, title: string, bold: PDFFont) {
  ensureSpace(pdf, ctx, 24);
  ctx.page.drawText(title, {
    x: MARGIN,
    y: ctx.y,
    font: bold,
    size: 13,
    color: GOLD
  });
  ctx.y -= 20;
}

function drawWrappedParagraph(
  pdf: PDFDocument,
  ctx: PdfContext,
  text: string,
  font: PDFFont,
  fontSize = 11,
  color = SOFT_BLACK,
  lineHeight = 14
) {
  const maxWidth = PAGE_SIZE[0] - MARGIN * 2;
  const lines = wrapText(text, font, fontSize, maxWidth);
  ensureSpace(pdf, ctx, lines.length * lineHeight + 4);

  for (const line of lines) {
    ctx.page.drawText(line, {
      x: MARGIN,
      y: ctx.y,
      font,
      size: fontSize,
      color
    });
    ctx.y -= lineHeight;
  }
}

function drawKeyValue(
  pdf: PDFDocument,
  ctx: PdfContext,
  key: string,
  value: string,
  bold: PDFFont,
  regular: PDFFont
) {
  const label = `${key}: `;
  const labelSize = 10.5;
  const valueSize = 10.5;
  const contentWidth = PAGE_SIZE[0] - MARGIN * 2;
  const labelWidth = bold.widthOfTextAtSize(label, labelSize);
  const valueMaxWidth = Math.max(50, contentWidth - labelWidth);
  const lines = wrapText(value, regular, valueSize, valueMaxWidth);
  const neededHeight = Math.max(1, lines.length) * 13;

  ensureSpace(pdf, ctx, neededHeight + 2);

  ctx.page.drawText(label, {
    x: MARGIN,
    y: ctx.y,
    font: bold,
    size: labelSize,
    color: SOFT_BLACK
  });

  ctx.page.drawText(lines[0] ?? "", {
    x: MARGIN + labelWidth,
    y: ctx.y,
    font: regular,
    size: valueSize,
    color: SOFT_GRAY
  });

  for (let i = 1; i < lines.length; i += 1) {
    ctx.y -= 13;
    ctx.page.drawText(lines[i], {
      x: MARGIN + labelWidth,
      y: ctx.y,
      font: regular,
      size: valueSize,
      color: SOFT_GRAY
    });
  }

  ctx.y -= 15;
}

export async function generateVehicleSheetPdf(vehicle: Vehicle, dealer: DealerInfo, options: PdfOptions = {}) {
  const locale = options.locale ?? "en";
  const labels = PDF_LABELS[locale];
  const statusLabel = STATUS_TEXT[locale][vehicle.status] ?? String(vehicle.status).toUpperCase();

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ctx: PdfContext = {
    page: pdf.addPage(PAGE_SIZE),
    y: PAGE_SIZE[1] - MARGIN
  };

  const businessName = dealer.business_name || "OMB AUTO SALES";
  const address = dealer.address || "710 W Veterans Memorial Blvd, Killeen, TX 76541";
  const phone = dealer.phone || "(254) 393-5554";
  const generatedAt = new Date().toLocaleString(toIntlLocale(locale));

  ctx.page.drawText(businessName, {
    x: MARGIN,
    y: ctx.y,
    font: bold,
    size: 20,
    color: SOFT_BLACK
  });
  ctx.y -= 24;

  drawWrappedParagraph(pdf, ctx, `${address} | ${phone}`, regular, 10, SOFT_GRAY, 12);
  drawWrappedParagraph(pdf, ctx, `${labels.generated}: ${generatedAt}`, regular, 9, SOFT_GRAY, 12);
  ctx.y -= 2;

  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_SIZE[0] - MARGIN, y: ctx.y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85)
  });
  ctx.y -= SECTION_GAP;

  const title =
    vehicle.title || `${normalizeValue(vehicle.year, labels)} ${normalizeValue(vehicle.make, labels)} ${normalizeValue(vehicle.model, labels)}`;
  drawSectionTitle(pdf, ctx, title, bold);
  drawKeyValue(pdf, ctx, labels.status, statusLabel, bold, regular);
  drawKeyValue(pdf, ctx, labels.price, formatPrice(vehicle.price, labels, locale), bold, regular);

  const imageUrl = vehicle.main_image_url || (vehicle.gallery_urls?.[0] ?? null);
  if (imageUrl) {
    const image = await embedImageFromUrl(pdf, imageUrl);
    if (image) {
      const maxWidth = PAGE_SIZE[0] - MARGIN * 2;
      const maxHeight = 250;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const imageWidth = image.width * scale;
      const imageHeight = image.height * scale;

      ensureSpace(pdf, ctx, imageHeight + 20);
      const x = MARGIN + (maxWidth - imageWidth) / 2;
      const y = ctx.y - imageHeight;
      ctx.page.drawImage(image, { x, y, width: imageWidth, height: imageHeight });
      ctx.y = y - SECTION_GAP;
    }
  }

  drawSectionTitle(pdf, ctx, labels.vehicleInformation, bold);

  const info: Array<[string, string]> = [
    [labels.year, normalizeValue(vehicle.year, labels)],
    [labels.make, normalizeValue(vehicle.make, labels)],
    [labels.model, normalizeValue(vehicle.model, labels)],
    [labels.trim, normalizeValue(vehicle.trim, labels)],
    [labels.mileage, formatMileage(vehicle.mileage, labels, locale)],
    [labels.vin, normalizeValue(vehicle.vin, labels)],
    [labels.color, normalizeValue(vehicle.color, labels)],
    [labels.drivetrain, normalizeValue(vehicle.drivetrain, labels)],
    [labels.transmission, normalizeValue(vehicle.transmission, labels)],
    [labels.fuelType, normalizeValue(vehicle.fuel_type, labels)],
    [labels.featured, normalizeValue(vehicle.featured, labels)],
    [labels.published, normalizeValue(vehicle.published, labels)],
    [labels.created, new Date(vehicle.created_at).toLocaleDateString(toIntlLocale(locale))],
    [labels.updated, new Date(vehicle.updated_at).toLocaleDateString(toIntlLocale(locale))]
  ];

  for (const [key, value] of info) {
    drawKeyValue(pdf, ctx, key, value, bold, regular);
  }

  if (vehicle.highlights.length > 0) {
    drawSectionTitle(pdf, ctx, labels.highlights, bold);
    for (const highlight of vehicle.highlights) {
      drawWrappedParagraph(pdf, ctx, `• ${highlight}`, regular, 10.5, SOFT_GRAY, 13);
    }
    ctx.y -= 6;
  }

  if (vehicle.description) {
    drawSectionTitle(pdf, ctx, labels.description, bold);
    drawWrappedParagraph(pdf, ctx, vehicle.description, regular, 10.5, SOFT_GRAY, 13);
    ctx.y -= 6;
  }

  if (vehicle.specs && typeof vehicle.specs === "object" && !Array.isArray(vehicle.specs)) {
    const specEntries = Object.entries(vehicle.specs);
    if (specEntries.length > 0) {
      drawSectionTitle(pdf, ctx, labels.additionalSpecs, bold);
      for (const [key, value] of specEntries) {
        drawKeyValue(pdf, ctx, key, normalizeSpecValue(value, labels), bold, regular);
      }
    }
  }

  const filenameBase = sanitizeFilename(vehicle.slug || vehicle.title || vehicle.id) || "vehicle-sheet";
  const bytes = await pdf.save();
  return {
    bytes,
    filename: `${filenameBase}.pdf`
  };
}
