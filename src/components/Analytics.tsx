"use client";

import { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { GA_ID, track } from "@/lib/track";

// Google Analytics 4, loaded only once the visitor has accepted analytics cookies.
// Page views are sent on every page change (the site is a single-page app, so the default
// "page load" measurement would miss most of the journey).

function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    // Counted by our own anonymous counter always; Google Analytics only hears it once it is loaded with consent.
    track("page_view", { page_path: pathname + (search?.toString() ? `?${search}` : ""), page_location: window.location.href, page_title: document.title });
  }, [pathname, search]);

  return null;
}

export default function Analytics() {
  const { consent } = useCookieConsent();
  const ga = !!GA_ID && !!consent?.analytics;
  return (
    <>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
      {ga && (
        <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false,anonymize_ip:true});`}
      </Script>
        </>
      )}
    </>
  );
}
