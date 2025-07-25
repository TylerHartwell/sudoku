"use client"

import { createContext, useContext, useState, useEffect } from "react"

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

const themeInit = () => {
  let theme = localStorage.getItem("theme")
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  document.documentElement.setAttribute("data-theme", theme)
}

export const themeInitScriptString = `(${themeInit.toString()})();`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      let theme = localStorage.getItem("theme")

      if (!theme) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      }
      return theme
    }
    return "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
