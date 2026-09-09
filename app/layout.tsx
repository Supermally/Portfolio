import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/lib/content/ContentProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://malachimcdonald.com"),
  title: "Malachi McDonald | Grand Central — Engineering Transit Portfolio",
  description:
    "An interactive transit map charting intersections between Computer Systems, Aerospace Engineering, and Technology Policy.",
  keywords: [
    "Malachi McDonald",
    "Grand Central",
    "Computer Systems",
    "Aerospace Engineering",
    "Technology Policy",
    "Embedded Systems",
    "Interactive Transit Map",
  ],
  authors: [{ name: "Malachi McDonald" }],
  creator: "Malachi McDonald",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://malachimcdonald.com",
    siteName: "Malachi McDonald — Grand Central",
    title: "Malachi McDonald | Grand Central — Engineering Transit Portfolio",
    description:
      "Explore engineering projects charted across Computer Systems, Aerospace Dynamics, and Technology Policy on an interactive transit map.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Malachi McDonald — Grand Central Transit Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malachi McDonald | Grand Central — Engineering Transit Portfolio",
    description:
      "Explore engineering projects charted across Computer Systems, Aerospace Dynamics, and Technology Policy on an interactive transit map.",
    images: ["/og-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen bg-[#faf8f5] text-zinc-900 antialiased selection:bg-orange-500/20 selection:text-orange-950 font-sans">
        <div className="fixed inset-0 pointer-events-none transit-map-paper z-0 opacity-70" aria-hidden="true" />
        <ContentProvider><div className="relative z-10">{children}</div></ContentProvider>
      </body>
    </html>
  );
}
