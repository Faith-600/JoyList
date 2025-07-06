"use client";

import { useTheme } from "next-themes";
import { type Theme } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Lock } from "lucide-react";

interface ThemeSelectorProps {
  availableThemes: Theme[]; 
  allThemes: Theme[];       
  currentKarma: number;
}

export const ThemeSelector = ({ availableThemes, allThemes, currentKarma }: ThemeSelectorProps) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Unlocked Themes</DropdownMenuLabel>
        {availableThemes.map((theme) => (
          <DropdownMenuItem key={theme.id} onSelect={() => setTheme(theme.id)}>
            {theme.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Locked Themes</DropdownMenuLabel>
        {allThemes
          .filter((theme) => !availableThemes.some((at) => at.id === theme.id))
          .map((theme) => (
            <DropdownMenuItem key={theme.id} disabled>
              <Lock className="mr-2 h-4 w-4" />
              <span>{theme.name} ({theme.karmaRequired - currentKarma} more karma)</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};