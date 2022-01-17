import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as gtag from "../lib/gtag";

import Header from "@/components/Header";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handlerRouteChange = (path: string) => {
      gtag.pageview(path);
    };
    router.events.on("routeChangeComplete", handlerRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handlerRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        defer
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" defer strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <ChakraProvider>
        <Header />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

export default MyApp;
