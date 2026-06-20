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
  description:
    'A premium AI-powered chess experience — where light and dark strategies collide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.className} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-white text-black antialiased">
        <Navbar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-8 sm:py-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
