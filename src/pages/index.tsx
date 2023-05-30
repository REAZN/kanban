import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components";

export const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kanban</title>
        <meta name="description" content="Kanban" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Header />
    </>
  );
};

export default Home;
