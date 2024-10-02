import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudoku Ruler",
  description: "For practice recognizing certain sudoku rules"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[rgb(168,_168,_168)] text-[16px] font-sans min-h-screen w-screen min-w-min m-0 select-none touch-pan-y`}
      >
        {children}
      </body>
    </html>
  )
}
