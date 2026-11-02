import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/site/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Origin only: Next.js adds the base path (e.g. /Portfolio) to metadata URLs itself.
  metadataBase: new URL(new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").origin),
  title: {
    default: "Faheem Muhamed — Visual Designer",
    template: "%s — Faheem Muhamed",
  },
  description:
    "Faheem Muhamed is a visual designer in Bengaluru working across brand, marketing, product, illustration, 3D and motion.",
  openGraph: { type: "website", siteName: "Faheem Muhamed" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
