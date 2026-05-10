import type { Metadata } from 'next';

export const siteName = 'SeriesApp';
export const siteDescription = 'ดูซีรีส์แนวตั้งยอดนิยม พากย์ไทยและซับไทย พร้อมรายการใหม่และตอนล่าสุดบน SeriesApp';

type PageMetadataInput = {
  title: string;
  description: string;
  image?: string | null;
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

export function createPageMetadata({ title, description, image, noIndex = false }: PageMetadataInput): Metadata {
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
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: normalizedDescription,
      images: image ? [image] : undefined,
    },
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
