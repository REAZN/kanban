import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";

export const LoginConnections = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Login Connections</CardTitle>
          <CardDescription>Your connected accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-x-1.5">
          {/* <Button className="space-x-2"> */}
          {/* <FontAwesomeIcon icon={faGithub} className="w-5 h-5" /> */}
          {/* <span>GitHub</span> */}
          {/* </Button> */}
          <Button className="space-x-2 bg-[#5865F2] text-white">
            <FontAwesomeIcon icon={faDiscord} className="w-5 h-5 " />
            <span>Discord</span>
          </Button>
        </CardContent>
      </Card>
      <div className="flex items-center rounded-lg border bg-card text-card-foreground shadow-sm px-6 py-3 gap-6">
        <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
        <div>
          <h3 className="font-medium">Discord</h3>
          <p className="text-sm text-muted-foreground">REAZN</p>
        </div>
      </div>
    </>
  );
};
