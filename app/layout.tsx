import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getLocale } from "@/lib/i18n/server-locale";
import { getPublicSiteSettings } from "@/lib/db/site-settings";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap"
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title =
    locale === "es"
      ? "OMB AUTO SALES | Dealer de autos de lujo en Killeen, TX"
      : "OMB AUTO SALES | Luxury Car Dealership in Killeen, TX";
  const description =
    locale === "es"
      ? "Descubre vehículos premium en OMB AUTO SALES, 710 W Veterans Memorial Blvd, Killeen, TX."
      : "Discover premium luxury vehicles at OMB AUTO SALES, 710 W Veterans Memorial Blvd, Killeen, TX.";

  return {
    title,
    description,
    metadataBase: new URL("https://www.ombautosalesandservices.com"),
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "https://www.ombautosalesandservices.com",
      siteName: "OMB Auto Sales & Services",
      locale: locale === "es" ? "es_US" : "en_US",
      type: "website"
    },
    robots: { index: true, follow: true },
    keywords: [
      "used cars Killeen TX", "car dealership Killeen TX", "used car dealer Killeen",
      "OMB Auto Sales", "carros usados en Killeen Texas", "autos for sale Killeen"
    ],
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "512x512", type: "image/png" }
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon-32x32.png"]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const settings = await getPublicSiteSettings(locale);
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": "https://www.ombautosalesandservices.com/#dealer",
    name: settings.business_name,
    url: "https://www.ombautosalesandservices.com",
    telephone: settings.phone,
    image: "https://www.ombautosalesandservices.com/omb-auto-sales-logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "710 W Veterans Memorial Blvd",
      addressLocality: "Killeen",
      addressRegion: "TX",
      postalCode: "76541",
      addressCountry: "US"
    },
    areaServed: [
      { "@type": "City", name: "Killeen" },
      { "@type": "City", name: "Harker Heights" },
      { "@type": "City", name: "Copperas Cove" },
      { "@type": "City", name: "Fort Cavazos" }
    ],
    hasMap: "https://www.google.com/maps/search/?api=1&query=710+W+Veterans+Memorial+Blvd+Killeen+TX+76541"
  };

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
