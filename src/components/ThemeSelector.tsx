"use client"

import { useTheme } from "@/contexts/ThemeContext"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="absolute right-1 text-[.5em] md:text-[1em]">
      <select
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value)
          const html = document.documentElement
          html.classList.add("disable-transitions")

          requestAnimationFrame(() => {
            html.classList.remove("disable-transitions")
          })
        }}
        className="bg-primary border p-[.1em]"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="neon">Neon</option>
      </select>
    </div>
  )
}
