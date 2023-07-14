import Head from "next/head";
import { Header } from "@/components";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const settings = [
  { name: "Account", href: "/settings/account" },
  { name: "General", href: "/settings/general" },
  { name: "Login Connections", href: "/settings/login-connections" },
];

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        {/* TODO global title prefix */}
        <title>Kanban - Settings</title>
      </Head>
      <Header />
      <div className="relative mt-16">
        <div className="py-12 text-2xl max-w-6xl mx-auto font-medium px-4">
          Account Settings
        </div>
        <hr />
        <div className="flex gap-4 m-8 max-w-6xl mx-auto px-4">
          <div className="relative basis-[20%]">
            <nav className="flex flex-col space-y-2 sticky top-[5rem]">
              {settings.map((setting) => (
                <Link
                  className={cn(
                    `rounded-md p-1.5 px-2.5 hover:bg-muted text-muted-foreground`,
                    router.pathname === setting.href &&
                      "text-primary font-medium"
                  )}
                  key={setting.name}
                  href={setting.href}
                >
                  {setting.name}
                </Link>
              ))}
            </nav>
          </div>
          <section className="flex flex-col space-y-4 flex-1">
            {children}
          </section>
        </div>
      </div>
    </>
  );
};
