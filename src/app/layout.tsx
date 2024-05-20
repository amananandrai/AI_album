import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GalleryProvider } from "./context/gallery";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Gallery",
  description: "A gallery of AI generated images",
  authors: [
    {
      name: "amananandrai",
      url: "https://github.com/amananandrai",
    },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GalleryProvider>
        <body className={inter.className}>{children}</body>
      </GalleryProvider>

    </html>
  );
}
