import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faStar, faFilm } from '@fortawesome/free-solid-svg-icons';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'ดูซีรีส์แนวตั้งฟรี',
  description: 'รวมซีรีส์แนวตั้งยอดนิยม ซีรีส์มาใหม่ พากย์ไทยและซับไทย ดูรายการทั้งหมดได้ในที่เดียวบน SeriesApp',
});

// Fetch real data from Backend API
async function getSeries(filter: string): Promise<SeriesProps[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    let query = '';
    
    if (filter === 'popular') query = '?isPopular=true';
    if (filter === 'new') query = '?isNewSeries=true';
    
    const res = await fetch(`${apiUrl}/series${query}`, {
      cache: 'no-store' // Use 'force-cache' or 'revalidate' in production
    });
    
    if (!res.ok) {
      console.error('Failed to fetch series');
      return [];
    }
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching series:', error);
    return [];
  }
}

export default async function Home() {
  const [popularSeries, newSeries, allSeries] = await Promise.all([
    getSeries('popular'),
    getSeries('new'),
    getSeries('all'),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      <SeriesSection title="ซีรีส์ยอดนิยม" icon={faFire} iconClassName="text-orange-400" series={popularSeries.slice(0, 12)} />
      <SeriesSection title="ซีรีส์มาใหม่" icon={faStar} iconClassName="text-yellow-300" series={newSeries.slice(0, 12)} />
      <SeriesSection
        title="ซีรีส์ทั้งหมด"
        icon={faFilm}
        iconClassName="text-[var(--color-primary)]"
        series={allSeries.slice(0, 12)}
        action={<Link href="/category/all" className="text-sm font-bold text-[var(--color-primary)] hover:underline">ดูเพิ่มเติม</Link>}
      />
    </div>
  );
}

function SeriesSection({
  title,
  icon,
  iconClassName,
  series,
  action,
}: {
  title: string;
  icon: typeof faFilm;
  iconClassName: string;
  series: SeriesProps[];
  action?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
          <FontAwesomeIcon icon={icon} className={iconClassName} />
          <span>{title}</span>
        </h2>
        {action}
      </div>

      {series.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {series.map((item) => (
            <SeriesCard key={item._id} series={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
          ยังไม่มีซีรีส์ในหมวดนี้
        </div>
      )}
    </section>
  );
}
