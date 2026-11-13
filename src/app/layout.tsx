import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Sora } from "next/font/google";
import { DiaryProvider } from "@/components/providers/DiaryProvider";
import { readDiary } from "@/lib/diary/store";
import "./globals.css";

export const dynamic = "force-dynamic";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const diary = await readDiary();
  return {
    title: diary.site.coupleName,
    description: diary.site.welcomeTagline,
  };
}

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const diary = await readDiary();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrument.variable} ${sora.variable} antialiased`}>
        <DiaryProvider diary={diary}>{children}</DiaryProvider>
      </body>
    </html>
  );
}
