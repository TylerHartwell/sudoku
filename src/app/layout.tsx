import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./css/globals.css"
import { themeInitScriptString, ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudoku Ruler",
  description:
    "Practice solving sudoku puzzles and automatically perform common strategies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className="text-copy bg-primary size-full font-sans text-[16px]"
      >
        <head>
          <script
            id="theme-loader"
            dangerouslySetInnerHTML={{ __html: themeInitScriptString }}
          />
        </head>
        <body
          className={`${inter.className} b3 grid h-full min-h-fit w-full touch-pan-y select-none grid-cols-1 md:min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
