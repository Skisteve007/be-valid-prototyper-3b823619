import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Apply theme to document
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    
    if (dark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    let prefersDark = false;
    
    if (savedTheme === "dark") {
      prefersDark = true;
    } else if (savedTheme === "light") {
      prefersDark = false;
    } else {
      // No saved preference - check system preference
      prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    
    setIsDark(prefersDark);
    applyTheme(prefersDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Theme"
      className="h-14 w-14 text-foreground hover:bg-muted"
    >
      {isDark ? <Sun className="h-10 w-10" /> : <Moon className="h-10 w-10" />}
    </Button>
  );
}