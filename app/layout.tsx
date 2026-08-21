import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionPreferenceProvider } from "@/components/motion/motion-preference";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Park Place Dental | General Dentistry in Booneville, MS",
  description:
    "Park Place Dental is a general dental practice in Booneville, Mississippi, serving Prentiss County with calm, modern, unintimidating care.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionPreferenceProvider>
          <LenisProvider>{children}</LenisProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
