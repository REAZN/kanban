import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  BookIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardStore } from "@/store";

import { BoardSwitcher, TeamSwitcher } from "@/components";
import { Divider } from "@/assets/icons";
import { api, type RouterOutputs } from "@/lib/api";
import { useEffect } from "react";

type User = RouterOutputs["user"]["get"];

export const Header = ({ dashboard }: { dashboard: string }) => {
  const { data: sessionData } = useSession();
  const { board, setUser } = useBoardStore();

  const { data: userData } = api.user.get.useQuery({
    username: dashboard,
  });

  useEffect(() => {
    setUser(userData ?? undefined);
  }, [setUser, userData]);

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center ">
          <Link href="/" className="text-2xl font-bold">
            LOGO
          </Link>
          <Divider />
          <Link
            href={`/${userData?.username ?? "dashboard"}`}
            className="flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={userData?.image ?? ""}
                alt={userData?.name ?? "Avatar"}
              />
              <AvatarFallback>
                {userData?.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userData?.username}</span>
          </Link>
          {/*<TeamSwitcher/>*/}
          {/*<Divider/>*/}
          {board && (
            <>
              <Divider />
              <BoardSwitcher />
            </>
          )}
        </div>
        {/* <nav className={"mx-6 flex items-center space-x-4 lg:space-x-6"}>
          <Link
            href="/example"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Board
          </Link>
          <Link
            href="/example"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Draw
          </Link>
        </nav> */}
        <div className="ml-auto flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 md:w-[200px] lg:w-[300px]"
          />
          {sessionData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={sessionData?.user?.image ?? ""}
                      alt={sessionData?.user?.name ?? "Avatar"}
                    />
                    <AvatarFallback>
                      {sessionData?.user?.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sessionData?.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {sessionData?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={`/${sessionData?.user?.username}`}>
                    <DropdownMenuItem>
                      <BookIcon className="mr-2 h-4 w-4" />
                      <span>Your boards</span>
                      {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <Link href="/settings/account">
                    <DropdownMenuItem>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>New Board</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={
                    sessionData ? () => void signOut() : () => void signIn()
                  }
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>{sessionData ? "Logout" : "Login"}</span>
                  {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => void signIn()}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};
