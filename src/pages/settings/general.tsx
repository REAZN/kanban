import { type NextPage } from "next";
import Head from "next/head";
import { SettingsLayout } from "@/components";
import { ThemeChanger } from "@/components/settings";

export const General: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kanban - General</title>
      </Head>
      <SettingsLayout>
        <ThemeChanger />
      </SettingsLayout>
    </>
  );
};

export default General;
