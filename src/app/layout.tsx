import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

// Configure fontawesome to skip adding CSS automatically since it causes a flicker
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
      <body className="min-h-screen bg-black text-white antialiased flex flex-col">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
