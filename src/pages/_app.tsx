import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    </Head>
    <Component {...pageProps} />
  </ChakraProvider>
}

export default App
