import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/Themeprovide";
import { themes } from "@/config/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JoyList",
  description: "A fun todo app!",
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={themes.map(t => t.id)}
          enableSystem
        > 
        {children}
          <Toaster position="top-right" richColors />
         </ThemeProvider>
      </body>
    </html>
    
  );
}
