import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support Ticket System",
  description: "Simple support ticket system for learning PostHog integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <nav className="bg-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold text-white">
                  🎫 Support Portal
                </a>
              </div>
              <div className="flex space-x-8">
                <a href="/" className="text-white hover:text-blue-200">
                  All Tickets
                </a>
                <a href="/submit" className="text-white hover:text-blue-200">
                  Submit Ticket
                </a>
                <a href="/staff" className="text-white hover:text-blue-200">
                  Staff View
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
