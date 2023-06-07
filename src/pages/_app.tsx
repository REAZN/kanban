import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ['latin']
});

import "@/styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <>
      <style jsx global>
        {`:root { --font-inter: ${inter.style.fontFamily}; }`}
      </style>
      <Head>
        <title>Kanban</title>
        <meta name="description" content="Kanban" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false}/>
    </>
  );
};

export default api.withTRPC(MyApp);
