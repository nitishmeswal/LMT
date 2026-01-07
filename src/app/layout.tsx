import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "NeuroNirvana - Digital Consciousness Dispensary",
  description: "Experience safe, legal, science-backed altered states through binaural beats and immersive visuals",
  keywords: ["binaural beats", "meditation", "altered states", "wellness", "consciousness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neuro-deep min-h-screen antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
