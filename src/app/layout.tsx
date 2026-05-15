import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./css/globals.css"
import { themeInitScriptString, ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://sudoku.tylerhartwell.com/"

export const metadata: Metadata = {
  title: "Sudoku Ruler",
  description:
    "Practice solving sudoku puzzles and automatically perform common strategies",
  metadataBase: new URL(siteUrl),
  applicationName: "Sudoku Ruler",
  keywords: ["sudoku", "solver", "puzzles", "logic", "strategy"],
  openGraph: {
    title: "Sudoku Ruler",
    description:
      "Practice solving sudoku puzzles and automatically perform common strategies",
    url: siteUrl,
    siteName: "Sudoku Ruler",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku Ruler",
    description:
      "Practice solving sudoku puzzles and automatically perform common strategies",
  },
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
        className="text-copy bg-primary font-sans text-[16px]"
      >
        <head>
          <Script id="theme-loader" strategy="beforeInteractive">
            {themeInitScriptString}
          </Script>
        </head>
        <body className={`${inter.className} touch-pan-y select-none`}>
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
