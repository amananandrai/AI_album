import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { GalleryProvider } from "./context/gallery";
import { Navbar } from "@/components/ui/navbar";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
};

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
    <html lang="en" className={baloo.variable}>
      <body>
        <GalleryProvider>
          <Navbar />
          {children}
        </GalleryProvider>
      </body>
    </html>
  );
}
