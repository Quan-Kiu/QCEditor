import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CSSProperties } from "react";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import { AuthContextProvider } from "@/context/AuthContext";
import { CoderContextProvider } from "@/context/CoderContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QCEditor",
  description: "QCEditor",
};

const cssVariables = {
  "--navbarHeight": "32px",
  "--sidebarWidth": "200px",
} as CSSProperties;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html translate="no" style={cssVariables} lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <AuthContextProvider>
            <CoderContextProvider>{children}</CoderContextProvider>
          </AuthContextProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
