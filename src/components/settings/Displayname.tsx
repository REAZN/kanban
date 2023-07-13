import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

export const Displayname = () => {
  const { data: sessionData, update } = useSession();

  const [displayname, setDisplayname] = useState<string>("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  useEffect(() => {
    setDisplayname(sessionData?.user?.name ?? "");
  }, [sessionData?.user?.name]);

  const updateDisplayname = api.user.updateDisplayname.useMutation({
    onSuccess: () => {
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
        <CardTitle>Display Name</CardTitle>
        <CardDescription>
          This is your display name, it can be changed at any time and is what
          most people will identify you with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex space-x-2 items-start"
          onSubmit={(e) => {
            e.preventDefault();
            updateDisplayname.mutate({
              name: displayname,
            });
          }}
        >
          <div className="flex h-9">
            <input
              className="text-sm  h-9 pl-2 bg-transparent border outline-none rounded-md focus:border-muted-foreground w-full"
              value={displayname}
              onChange={(e) => setDisplayname(e.target.value)}
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
