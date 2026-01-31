import type { Metadata } from "next";
import { ReadwiseProvider } from "@/lib/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipSavvy - Readwise Highlights",
  description: "A modern frontend for viewing and managing your Readwise highlights",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReadwiseProvider>{children}</ReadwiseProvider>
      </body>
    </html>
  );
}
