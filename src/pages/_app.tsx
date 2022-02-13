import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import * as gtag from "../lib/gtag";

import Header from "@/components/Header";

const queryClient = new QueryClient();

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "white",
        color: "black",
      },
    },
  },
});

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
      <Head>
        <title>レノファ駐車場情報サイト</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
