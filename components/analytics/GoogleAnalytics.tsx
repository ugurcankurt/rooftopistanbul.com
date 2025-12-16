'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId?: string }) {
  // If no ID is provided, try to get it from environment
  // Note: Env vars must be public (NEXT_PUBLIC_) to be visible here
  const measurementId = gaId || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
