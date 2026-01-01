import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BELIEVE & WISDOM - Institut de beauté & massage",
  description: "Institut de beauté et de bien-être. Soins du visage, soins du corps, massages bien-être. La beauté en équilibre.",
  keywords: "institut beauté, massage, soins visage, soins corps, bien-être, esthétique",
  icons: {
    icon: '/believe.jpeg',
    apple: '/believe.jpeg',
  },
  openGraph: {
    title: "BELIEVE & WISDOM - Institut de beauté & massage",
    description: "Institut de beauté et de bien-être. Soins du visage, soins du corps, massages bien-être. La beauté en équilibre.",
    images: ['/believe.jpeg'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "BELIEVE & WISDOM - Institut de beauté & massage",
    description: "Institut de beauté et de bien-être. Soins du visage, soins du corps, massages bien-être. La beauté en équilibre.",
    images: ['/believe.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

