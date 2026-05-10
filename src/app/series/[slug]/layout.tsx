import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata, fetchSeriesSeo, siteDescription, trimDescription } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const series = await fetchSeriesSeo(slug);

  if (!series) {
    return createPageMetadata({
      title: 'รายละเอียดซีรีส์',
      description: siteDescription,
    });
  }

  return createPageMetadata({
    title: series.title,
    description: trimDescription(series.description),
    image: series.posterUrl,
  });
}

export default function SeriesDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
