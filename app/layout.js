
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import SiteNav from '@/components/SiteNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Grand Pilgrimage of India',
  description: 'An extraordinary spiritual odyssey across India.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
