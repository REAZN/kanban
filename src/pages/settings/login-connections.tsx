import { type NextPage } from "next";
import Head from "next/head";
import { SettingsLayout } from "@/components";
import { LoginConnections } from "@/components/settings";

export const General: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kanban - Login Connections</title>
      </Head>
      <SettingsLayout>
        <LoginConnections />
      </SettingsLayout>
    </>
  );
};

export default General;
