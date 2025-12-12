import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { CurrencyProvider } from "@/context/CurrencyContext";
import WhatsAppButton from "@/components/ui/whatsapp-button";

const inter = Inter({ subsets: ["latin"] });


export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Layout.metadata' });

  return {
    metadataBase: new URL('https://rooftopistanbul.com'),
    title: {
      template: '%s | Rooftop Istanbul',
      default: t('title')
    },
    description: t('description'),
    icons: {
      icon: '/logo.png', // Fallback/Explicit
      apple: '/logo.png'
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://rooftopistanbul.com',
      siteName: 'Rooftop Istanbul',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png', // Explicitly referencing the file-based OG image if needed, or Next.js auto-discovery
          width: 1200,
          height: 630,
          alt: 'Rooftop Istanbul Photoshoot',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/opengraph-image.png'],
    }
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const { locale } = await params;

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <Navbar />
            <main className="flex-grow">
              <Breadcrumbs />
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
