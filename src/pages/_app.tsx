import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ['latin']
});

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <>
      <style jsx global>
        {`:root { --font-inter: ${inter.style.fontFamily}; }`}
      </style>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
