import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export const Username = () => {
  const { data: sessionData, update } = useSession();

  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  useEffect(() => {
    setUsername(sessionData?.user?.username ?? "");
  }, [sessionData?.user?.username]);

  const updateUsername = api.user.updateUsername.useMutation({
    onSuccess: () => {
      toast("Username updated!");

      setStatus({ type: "success", message: "Username updated!" });
      void update();
    },
    onError: (err) => {
      setStatus({ type: "error", message: err.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>This is your unique username.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex space-x-2 items-start"
          onSubmit={(e) => {
            e.preventDefault();
            updateUsername.mutate({
              username,
            });
          }}
        >
          <div className="flex h-9">
            <div className="flex border rounded-s-md border-r-0 items-center justify-center bg-muted h-full aspect-square">
              <AtSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              className="text-sm h-9 pl-2 bg-transparent border outline-none rounded-e-md focus:border-muted-foreground w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
          </div>
          <Button size="md">Save</Button>
        </form>
      </CardContent>
      {status && (
        <CardFooter
          className={`${status.type === "error" ? "text-red-600" : ""}`}
        >
          {status.message}
        </CardFooter>
      )}
    </Card>
  );
};
