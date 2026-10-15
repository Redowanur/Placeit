import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VerifyBanner } from "@/components/VerifyBanner";
import { BRAND } from "@/lib/brand";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${BRAND.name}: ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description:
    "Final-year cohorts invite alumni who already work at companies to their campus, run screening tests and get shortlisted together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ink">
              Skip to content
            </a>
            <Header />
            <VerifyBanner />
            <main id="main">{children}</main>
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
