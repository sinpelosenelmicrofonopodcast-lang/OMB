import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getLocale } from "@/lib/i18n/server-locale";

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

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
