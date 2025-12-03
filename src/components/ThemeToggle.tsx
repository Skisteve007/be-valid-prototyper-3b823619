import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Function to set theme and update state
  const setTheme = (dark: boolean) => {
    if (dark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
    setIsDark(dark);
  };

  useEffect(() => {
    // Check saved preference, default to LIGHT if no preference
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark") {
      setTheme(true);
    } else if (savedTheme === "light") {
      setTheme(false);
    } else {
      // No saved preference - default to light theme
      setTheme(false);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(!isDark);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Theme"
      className="h-9 w-9 text-foreground hover:bg-muted"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
