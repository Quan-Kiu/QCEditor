import { AppContextProvider } from "@/context/AppContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { CoderContextProvider } from "@/context/CoderContext";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import { Inter } from "next/font/google";
import { CSSProperties } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QCEditor - Code together",
  description: "QCEditor - Code together",
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
        <AppContextProvider>
          <CookiesProvider>
            <AuthContextProvider>
              <CoderContextProvider>
                <AppContextProvider>{children}</AppContextProvider>
              </CoderContextProvider>
            </AuthContextProvider>
          </CookiesProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
