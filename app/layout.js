import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Solstice Chess',
  description: 'A premium AI-powered chess experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.className} h-full`}>
      <body className="flex min-h-full flex-col bg-[#050505] text-white antialiased">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
