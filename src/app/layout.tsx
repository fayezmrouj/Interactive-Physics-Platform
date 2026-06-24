import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة الفيزياء التفاعلية",
  description:
    "منصة تعليمية تفاعلية لفيزياء الصفين التاسع والعاشر، تعتمد على الكتب المدرسية الرسمية. ادرس الوحدات والدروس، استكشف القوانين والأمثلة، واختبر نفسك بالكويزات.",
  keywords: ["فيزياء", "تعليم", "تفاعلي", "الصف التاسع", "الصف العاشر", "الأردن"],
  authors: [{ name: "منصة الفيزياء التفاعلية" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} font-cairo antialiased bg-slate-50 text-slate-900 min-h-screen`}
      >
        {children}
        <Toaster />
        <Sonner position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
