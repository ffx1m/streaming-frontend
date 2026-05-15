import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import { getSiteUrl, jsonLdScriptProps, siteDescription, siteName } from '@/lib/seo';

// Configure fontawesome to skip adding CSS automatically since it causes a flicker
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    template: '%s | VSeries',
    default: 'VSeries - ดูซีรีส์แนวตั้งฟรี',
  },
  description: 'แอปพลิเคชันสำหรับดูซีรีส์แนวตั้งยอดนิยม พากย์ไทยและซับไทย',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: getSiteUrl(),
    description: siteDescription,
    inLanguage: 'th-TH',
  };

  return (
    <html lang="th" className="dark">
      <body className="min-h-screen bg-black text-white antialiased flex flex-col">
        <script {...jsonLdScriptProps(websiteJsonLd)} />
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
