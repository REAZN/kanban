import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LogOut, PlusCircle, Settings, User } from "lucide-react"


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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// const BoardSwitcher = dynamic(() => import("@/components/BoardSwitcher"), {
//   ssr: false
// });
// const BoardSwitcher = dynamic(() => import('./BoardSwitcher'), {
//   ssr: false,
// })
import { BoardSwitcher, TeamSwitcher } from "@/components";
import { Divider } from "@/assets/icons";


export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center ">
            <div className="text-2xl font-bold">LOGO</div>
            <Divider/>
            {/*<TeamSwitcher/>*/}
            {/*<Divider/>*/}
            <BoardSwitcher/>
          </div>
          <nav className={"flex items-center space-x-4 lg:space-x-6 mx-6"}>
            <Link href="/example" className="text-sm font-medium transition-colors hover:text-primary">
              Board
            </Link>
            <Link href="/example" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Draw
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 md:w-[100px] lg:w-[300px]"
            />
            {sessionData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sessionData?.user?.image ?? ""} alt={sessionData?.user?.name ?? "Avatar"}/>
                      <AvatarFallback>{sessionData?.user?.name?.charAt(0) ?? "?"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{sessionData?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {sessionData?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>New Board</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={sessionData ? () => void signOut() : () => void signIn()}>
                    <LogOut className="mr-2 h-4 w-4" />
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
      </div>
    </header>
  )
}