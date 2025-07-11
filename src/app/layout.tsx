import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GalleryProvider } from "./context/gallery";
import { Navbar } from "@/components/ui/navbar";
import { ThemeProvider } from "./context/theme";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <GalleryProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </GalleryProvider>
      </body>
    </html>
  );
}
