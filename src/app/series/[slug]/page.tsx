import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import SeriesClientView from '@/components/SeriesClientView';
import { createPageMetadata } from '@/lib/seo';

async function getSeriesDetails(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const res = await fetch(`${apiUrl}/series/${slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesDetails(slug);
  
  if (!series) {
    return createPageMetadata({
      title: 'ไม่พบซีรีส์',
      description: 'ขออภัย ไม่พบซีรีส์ที่คุณกำลังตามหา',
    });
  }

  return createPageMetadata({
    title: series.title,
    description: series.description,
    image: series.posterUrl,
  });
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = await getSeriesDetails(slug);

  if (!series) {
    notFound();
  }

  return <SeriesClientView series={series} />;
}
