import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/physics/install-prompt";
import { Analytics } from "@vercel/analytics/next";

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
  authors: [{ name: "المعلم فايز مروج" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "الفيزياء التفاعلية",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "P9UUiV60le_Kqjg0ws98ZVTgh_22Ld6Ff_BcrXCRsUU",
  },
  // Open Graph tags لمشاركة أفضل على Facebook و LinkedIn و WhatsApp
  openGraph: {
    title: "منصة الفيزياء التفاعلية",
    description:
      "منصة تعليمية تفاعلية لفيزياء الصفين التاسع والعاشر، تعتمد على الكتب المدرسية الرسمية. ادرس الوحدات والدروس، استكشف القوانين والأمثلة، واختبر نفسك بالكويزات.",
    url: "https://interactive-physics-platform.vercel.app",
    siteName: "منصة الفيزياء التفاعلية",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "منصة الفيزياء التفاعلية",
      },
    ],
  },
  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "منصة الفيزياء التفاعلية",
    description:
      "منصة تعليمية تفاعلية لفيزياء الصفين التاسع والعاشر، تعتمد على الكتب المدرسية الرسمية.",
    images: ["/icon-512.png"],
  },
  alternates: {
    canonical: "https://interactive-physics-platform.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data للموقع التعليمي
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "منصة الفيزياء التفاعلية",
    alternateName: "Interactive Physics Platform",
    url: "https://interactive-physics-platform.vercel.app",
    description:
      "منصة تعليمية تفاعلية لفيزياء الصفين التاسع والعاشر، تعتمد على الكتب المدرسية الرسمية.",
    inLanguage: "ar-JO",
    founder: {
      "@type": "Person",
      name: "المعلم فايز مروج",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    about: {
      "@type": "Thing",
      name: "الفيزياء",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JOD",
      description: "مجاني لجميع الطلاب",
    },
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} font-cairo antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner position="top-center" richColors closeButton />
          <InstallPrompt />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
