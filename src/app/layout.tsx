import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 min-h-screen flex flex-col antialiased">
        {/* Your global Navbar component would go here */}
        
        {/* The flex-grow class forces the content area to expand, pushing the footer down */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Amazon Compliance Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/50 mt-20 py-8 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-slate-500 leading-relaxed">
              As an Amazon Associate, Ping & Pixels earns from qualifying purchases. 
              This site contains affiliate links to products. We may receive a commission 
              for purchases made through these links at no additional cost to you.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              &copy; {new Date().getFullYear()} Ping & Pixels. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}