import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { Toaster } from "sonner";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Future of Gadgets",
    template: "%s | Future of Gadgets",
  },
  description: "Modern e-commerce platform for electronics and tech products. Browse laptops, desktops, monitors, keyboards, and headphones at great prices.",
  keywords: ["electronics", "gadgets", "laptops", "desktops", "monitors", "keyboards", "headphones", "tech products", "online electronics store"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Future of Gadgets",
    title: "Future of Gadgets",
    description: "Modern e-commerce platform for electronics and tech products. Browse laptops, desktops, monitors, keyboards, and headphones at great prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Future of Gadgets",
    description: "Modern e-commerce platform for electronics and tech products. Browse laptops, desktops, monitors, keyboards, and headphones at great prices.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href='https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' rel="stylesheet" />
      </head>
      <body className="antialiased bg-transparent">
        <AuthProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="light" 
          enableSystem
          > */}
            <ConditionalLayout>
              {children}
              <WhatsAppFloat/>
            </ConditionalLayout>
            <CookieConsent />
            <Toaster className="!bottom-16 sm:!bottom-5" />
          {/* </ThemeProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
