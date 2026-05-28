import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = ({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gerard's Portfolio - Delivery Tracker",
  description: "A showcase of my work and projects, demonstrating my skills and experience in software development, data science, and more. Explore my portfolio to see the impact I've made in various industries and how I can help drive innovation and success in your organization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
