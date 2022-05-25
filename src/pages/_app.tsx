import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import * as gtag from "../lib/gtag";

import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { NextSeo } from "next-seo";

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

  const title = "レノファ駐車場情報サイト";
  const description = "レノファ山口のホームゲームの駐車場の状況を確認できるサイトです。";

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
        <title>{title}</title>
      </Head>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          type: "website",
          url: "https://renofa-parking.web.app/",
          title: title,
          description: description,
          images: [
            {
              url: "https://renofa-parking.web.app/ogp.png",
              width: 1200,
              height: 630,
              alt: `${title}のOPG画像`,
            },
          ],
          site_name: title,
        }}
      />
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
