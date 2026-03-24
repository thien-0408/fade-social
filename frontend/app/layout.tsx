import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { AosInit } from "../components/AosInit";
import { NotificationProvider } from "../contexts/NotificationContext";
import { LoaderProvider } from "../contexts/LoaderContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "Fade",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
  },
  description: "Share your fleeting thoughts before the clock runs out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <NextTopLoader
          color="#6366f1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <AosInit />
        <LoaderProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
