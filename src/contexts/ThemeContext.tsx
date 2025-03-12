"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: (theme: string) => {},
})

export const useTheme = () => useContext(ThemeContext)

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
