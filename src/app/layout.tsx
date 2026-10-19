import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ping & Pixels",
  description: "The latest in gaming news, patch notes, and hardware breakdowns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden`}>
        
        {/* Artistic Backdrop Backdrop Layer */}
        <div 
          className="absolute top-0 left-0 w-full h-[600px] md:h-[800px] bg-cover bg-top bg-no-repeat pointer-events-none opacity-20 md:opacity-25 mix-blend-screen z-0 mask-image"
          style={{
            backgroundImage: "url('/backdrop.jpg')",
            // Creates a smooth vertical fade so it melts seamlessly into the slate-950 background
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Optional Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Navigation & Page Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <div className="flex-grow">
            {children}
          </div>

          {/* Global Amazon Compliance Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-sm mt-20 py-8 px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-slate-500 leading-relaxed">
                As an Amazon Associate, Ping & Pixels earns from qualifying purchases. 
                This site contains affiliate links to products. We may receive a commission 
                for purchases made through these links at no additional cost to you.
              </p>
              <p className="text-xs text-slate-600 mt-2">
                &copy; 2026 Ping & Pixels. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}