'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId?: string }) {
  // If no ID is provided, try to get it from environment
  // Note: Env vars must be public (NEXT_PUBLIC_) to be visible here
  const primaryId = gaId || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const crossDomainId = process.env.NEXT_PUBLIC_CROSS_DOMAIN_GA_ID;

  if (!primaryId && !crossDomainId) {
    return null;
  }

  // We load the script using the primary ID (or cross domain ID if primary doesn't exist)
  const scriptId = primaryId || crossDomainId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${scriptId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          ${primaryId ? `gtag('config', '${primaryId}');` : ''}
          ${crossDomainId ? `gtag('config', '${crossDomainId}');` : ''}
        `}
      </Script>
    </>
  );
}
