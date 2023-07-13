import { api } from "@/utils/api";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

export const DeleteAccount = () => {
  const [deleteField, setDeleteField] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const optionalFields = {
    username: "reazn",
    name: "",
    email: "dddd@lew.ist",
  };

  const deleteString = Object.values(optionalFields).find((field) => {
    return field.trim().length >= 3;
  });

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      void signOut();
    },
  });

  return (
    <Card className="border-red-600">
      <CardHeader>
        <CardTitle>Delete Personal Account</CardTitle>
        <CardDescription>
          Permanently delete your personal account. This will also permanently
          delete any boards you are the owner of. This action is non reversible,
          and data cannot be retrieved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          <DialogTrigger asChild>
            <Button
              size="md"
              className="bg-red-600"
              onClick={() => setOpen(true)}
            >
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Delete Account</DialogTitle>
              <DialogDescription>
                Permanently delete your personal account. This will also
                permanently delete any boards you are the owner of. This action
                non reversible, and data cannot be retrieved.
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="deleteField">
              Type{" "}
              <code className="border rounded-sm px-1 bg-muted">
                <strong>{deleteString}</strong>
              </code>{" "}
              to confirm:
            </Label>
            <input
              id="deleteField"
              className="h-9 pl-2 bg-transparent border outline-none rounded-md focus:border-muted-foreground w-full"
              value={deleteField}
              onChange={(e) => setDeleteField(e.target.value)}
            />
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className={`${
                  deleteString === deleteField
                    ? "cursor-pointer"
                    : "cursor-not-allowed hover:brightness-100"
                }`}
                onClick={() => {
                  if (deleteString === deleteField) {
                    deleteUser.mutate();
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
