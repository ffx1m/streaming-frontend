import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

// Configure fontawesome to skip adding CSS automatically since it causes a flicker
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'], 
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | SeriesApp',
    default: 'SeriesApp - ดูซีรีส์แนวตั้งฟรี',
  },
  description: 'แอปพลิเคชันสำหรับดูซีรีส์แนวตั้งยอดนิยม พากย์ไทยและซับไทย',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <body className={`${notoSansThai.className} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
