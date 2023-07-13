import { type NextPage } from "next";
import Head from "next/head";
import { SettingsLayout } from "@/components";
import { Username, Displayname, DeleteAccount } from "@/components/settings";

export const Account: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kanban - Account</title>
      </Head>
      <SettingsLayout>
        <Displayname />
        <Username />
        <DeleteAccount />
      </SettingsLayout>
    </>
  );
};

export default Account;
