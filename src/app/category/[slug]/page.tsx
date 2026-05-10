import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';

const categoryMetadata: Record<string, { title: string; description: string }> = {
  all: {
    title: 'ซีรีส์ทั้งหมด',
    description: 'รวมซีรีส์แนวตั้งทั้งหมดบน SeriesApp ทั้งพากย์ไทย ซับไทย รายการยอดนิยม และซีรีส์มาใหม่',
  },
  thai_dub: {
    title: 'ซีรีส์พากย์ไทย',
    description: 'รวมซีรีส์แนวตั้งพากย์ไทย ดูง่าย สนุกต่อเนื่อง บน SeriesApp',
  },
  thai_sub: {
    title: 'ซีรีส์ซับไทย',
    description: 'รวมซีรีส์แนวตั้งซับไทยสำหรับคนชอบเสียงต้นฉบับ พร้อมคำบรรยายไทยบน SeriesApp',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryMetadata[slug] || {
    title: 'หมวดหมู่ซีรีส์',
    description: 'เลือกดูซีรีส์แนวตั้งตามหมวดหมู่บน SeriesApp',
  };

  return createPageMetadata(meta);
}

async function getCategorySeries(slug: string): Promise<SeriesProps[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/series?category=${slug}&limit=24`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching category series:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const validCategories = ['all', 'thai_dub', 'thai_sub'];
  if (!validCategories.includes(slug)) {
    notFound();
  }

  const series = await getCategorySeries(slug);
  
  const categoryTitle = 
    slug === 'all' ? 'ซีรีส์ทั้งหมด' :
    slug === 'thai_dub' ? 'ซีรีส์พากย์ไทย' :
    'ซีรีส์ซับไทย';

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{categoryTitle}</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {validCategories.map(cat => (
            <Link 
              key={cat}
              href={`/category/${cat}`}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-bold transition-colors ${
                slug === cat 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[#1b1b1d] text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : cat === 'thai_dub' ? 'พากย์ไทย' : 'ซับไทย'}
            </Link>
          ))}
        </div>
      </div>
      
      {series.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {series.map((item) => (
            <SeriesCard key={item._id} series={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-14 text-center">
          <p className="font-bold">ยังไม่มีซีรีส์ในหมวดนี้</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">เมื่อเพิ่มข้อมูลจริงแล้ว รายการจะแสดงที่หน้านี้อัตโนมัติ</p>
          <Link href="/category/all" className="mt-5 inline-flex rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15">
            ดูซีรีส์ทั้งหมด
          </Link>
        </div>
      )}
    </div>
  );
}
