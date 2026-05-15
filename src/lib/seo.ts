import type { Metadata } from 'next';
import { getRequiredApiUrl } from '@/lib/api';

export const siteName = 'VSeries';
export const siteDescription = 'ดูซีรีส์แนวตั้งยอดนิยม พากย์ไทยและซับไทย พร้อมรายการใหม่และตอนล่าสุดบน VSeries';

type PageMetadataInput = {
  title: string;
  description: string;
  image?: string | null;
  canonical?: string;
  noIndex?: boolean;
};

type SeriesSeoData = {
  title: string;
  description?: string;
  posterUrl?: string;
};

export function trimDescription(value: string | undefined, maxLength = 155) {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  if (!normalized) return siteDescription;
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    },
  };
}

export function createPageMetadata({ title, description, image, canonical, noIndex = false }: PageMetadataInput): Metadata {
  const normalizedDescription = trimDescription(description);
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: {
      absolute: fullTitle,
    },
    description: normalizedDescription,
    openGraph: {
      title: fullTitle,
      description: normalizedDescription,
      siteName,
      type: 'website',
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: normalizedDescription,
      images: image ? [image] : undefined,
    },
    alternates: canonical ? { canonical } : undefined,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export async function fetchSeriesSeo(slug: string): Promise<SeriesSeoData | null> {
  try {
    const apiUrl = getRequiredApiUrl('series SEO metadata');
    const res = await fetch(`${apiUrl}/series/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}
