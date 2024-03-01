import { AI } from "@/app/action";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";

import { cn } from "@/lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AI>{children}</AI>
      </body>
    </html>
  );
}
