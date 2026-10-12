import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Spline_Sans, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";
import Vignette from "@/components/Vignette";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

const spline = Spline_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-spline-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UNiQ — under the hood",
    template: "%s · UNiQ",
  },
  description:
    "Field notes from a developer who likes understanding things deeply — Android modding, Linux, local AI, and practical experiments that turn curiosity into something useful.",
};

export const viewport: Viewport = {
  themeColor: "#06090d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chakra.variable} ${spline.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollTop />
        <Vignette />
      </body>
    </html>
  );
}
