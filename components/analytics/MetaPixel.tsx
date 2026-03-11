"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export default function MetaPixel({ pixelId }: { pixelId?: string }) {
    const defaultPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const finalPixelId = pixelId || defaultPixelId;
    
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!finalPixelId) return;

        // Ensure fbq is defined before calling
        // @ts-ignore
        if (typeof window !== 'undefined' && window.fbq) {
             // @ts-ignore
            window.fbq('track', 'PageView')
        }
    }, [pathname, searchParams, finalPixelId])

    if (!finalPixelId) {
        return null;
    }

    return (
        <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${finalPixelId}');
                    fbq('track', 'PageView');
                `,
            }}
        />
    );
}
