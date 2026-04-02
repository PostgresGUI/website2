import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://postgresmac.com"),
  alternates: {
    canonical: "/",
  },
  title: "A lightweight PostgreSQL client for Mac",
  description:
    "Beautiful, fast, and open source native macOS PostgreSQL client. Built with Swift. No Electron. No JVM. Free forever.",
  keywords: [
    "PostgreSQL",
    "Postgres",
    "macOS",
    "Mac",
    "database client",
    "SQL client",
    "PostgreSQL client",
    "native Mac app",
    "open source",
    "Swift",
    "pgAdmin alternative",
    "DBeaver alternative",
    "Postico alternative",
    "TablePlus alternative",
  ],
  openGraph: {
    title: "A lightweight PostgreSQL client for Mac",
    description:
      "Beautiful, fast, and open source native macOS PostgreSQL client.",
    type: "website",
    url: "https://postgresmac.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        {children}
      </body>
      <GoogleAnalytics gaId="G-Z6RJBJCCFK" />
    </html>
  );
}
