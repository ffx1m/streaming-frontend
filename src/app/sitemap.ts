import { MetadataRoute } from 'next';
import { getRequiredApiUrl, shouldLogApiFetchError } from '@/lib/api';

type SitemapSeries = {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
};

async function getSeriesUrls(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const apiUrl = getRequiredApiUrl('sitemap generation');
    const res = await fetch(`${apiUrl}/series?limit=1000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const series = (json.data || []) as SitemapSeries[];

    return series
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/series/${encodeURIComponent(item.slug)}`,
        lastModified: item.updatedAt || item.createdAt ? new Date(item.updatedAt || item.createdAt || '') : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
  } catch (error) {
    if (shouldLogApiFetchError()) {
      console.error('Error generating dynamic sitemap entries:', error);
    }
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/thai_dub`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/thai_sub`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const seriesRoutes = await getSeriesUrls(baseUrl);
  return [...staticRoutes, ...seriesRoutes];
}
