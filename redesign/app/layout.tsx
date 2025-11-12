import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "macOS Web - Modern Design",
  description: "A modern macOS web simulator built with Next.js and shadcn/ui",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-hidden">{children}</body>
    </html>
  )
}
