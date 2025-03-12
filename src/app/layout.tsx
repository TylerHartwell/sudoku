import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./css/globals.css"
import { themeInitScriptString, ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudoku Ruler",
  description: "For practice recognizing certain sudoku rules",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            id="theme-loader"
            dangerouslySetInnerHTML={{ __html: themeInitScriptString }}
          />
        </head>
        <body
          className={`${inter.className} bg-primary text-copy touch-pan-y select-none font-sans text-[16px]`}
        >
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
