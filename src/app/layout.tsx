import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";
import IntroSplash from "@/components/IntroSplash";
import CursorEffects from "@/components/CursorEffects";
import LightAtmosphere from "@/components/LightAtmosphere";
import HudOverlay from "@/components/HudOverlay";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UNiQ — notes from under the hood",
    template: "%s · UNiQ",
  },
  description:
    "Field notes from a developer who likes understanding things deeply — Android modding, Linux, local AI, and practical experiments that turn curiosity into something useful.",
};

export const viewport: Viewport = {
  themeColor: "#0a0d09",
};

const themeInitScript = `
  (function () {
    var root = document.documentElement;
    try {
      // UNiQ is a dark-mode journal by default. A visitor choice is still
      // respected, but there is no system-preference fallback.
      var stored = window.localStorage.getItem("uniq-theme");
      var theme = stored === "light" ? "light" : "dark";
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    } catch (error) {
      root.dataset.theme = "dark";
      root.style.colorScheme = "dark";
    }
    try {
      // Brand intro: once per browser session, never for reduced motion.
      if (!window.sessionStorage.getItem("uniq-splash")) {
        window.sessionStorage.setItem("uniq-splash", "1");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          root.dataset.splash = "on";
        }
      }
    } catch (error) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <LightAtmosphere />
        <IntroSplash />
        <Header />
        {children}
        <Footer />
        <ScrollTop />
        <HudOverlay />
        <CursorEffects />
      </body>
    </html>
  );
}
