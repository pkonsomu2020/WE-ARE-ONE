import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="outline" 
      onClick={toggleTheme}
      className="flex items-center justify-center w-full md:w-10 h-10 border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white transition-all duration-300 relative"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="ml-8 md:sr-only">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </Button>
  )
}
