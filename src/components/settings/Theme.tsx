import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store";
import { type Theme } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const themes: { name: Theme; image: string }[] = [
  {
    name: "system",
    image: "/images/themes/system.png",
  },
  {
    name: "light",
    image: "/images/themes/light.png",
  },
  {
    name: "dark",
    image: "/images/themes/dark.png",
  },
];

export const ThemeChanger = () => {
  const { theme, setTheme } = useSettingsStore();
  const [selected, setSelected] = useState<Theme>();
  useEffect(() => {
    setSelected(theme);
  }, [theme, setTheme]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interface Theme</CardTitle>
        <CardDescription>Customise the look of your interface.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 justify-between">
          {themes.map((theme) => (
            <div key={theme.name} className="w-full">
              <Image
                tabIndex={0}
                className={`w-full rounded-lg aspect-video ${
                  selected === theme.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setTheme(theme.name)}
                src={theme.image}
                alt={theme.name}
                width={550}
                height={300}
              />
              <p className="capitalize font-medium mt-1">{theme.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
