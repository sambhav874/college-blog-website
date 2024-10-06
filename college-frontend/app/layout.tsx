import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';  // Correct import of Link
import './globals.css';
import Navbar from '@/components/Navbar';

// Local fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Metadata for the website
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Navbar />
          {/* Main content */}
          <main className="flex-grow container mx-auto py-8 px-4">
            {children}
          </main>

          
          <footer className="bg-gray-200 p-4">
            <div className="container mx-auto text-center">
              &copy; {new Date().getFullYear()} College Name. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}