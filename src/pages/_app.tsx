import "@/styles/globals.css";
import Header from "@/components/Header";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
