import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { getRequiredApiUrl } from '@/lib/api';

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type CategorySeriesResponse = {
  series: SeriesProps[];
  pagination: Pagination | null;
};

const categoryMetadata: Record<string, { title: string; description: string }> = {
  all: {
    title: 'ซีรีส์ทั้งหมด',
    description: 'รวมซีรีส์แนวตั้งทั้งหมดบน VSeries ทั้งพากย์ไทย ซับไทย รายการยอดนิยม และซีรีส์มาใหม่',
  },
  thai_dub: {
    title: 'ซีรีส์พากย์ไทย',
    description: 'รวมซีรีส์แนวตั้งพากย์ไทย ดูง่าย สนุกต่อเนื่อง บน VSeries',
  },
  thai_sub: {
    title: 'ซีรีส์ซับไทย',
    description: 'รวมซีรีส์แนวตั้งซับไทยสำหรับคนชอบเสียงต้นฉบับ พร้อมคำบรรยายไทยบน VSeries',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryMetadata[slug] || {
    title: 'หมวดหมู่ซีรีส์',
    description: 'เลือกดูซีรีส์แนวตั้งตามหมวดหมู่บน VSeries',
  };

  return createPageMetadata(meta);
}

function getPageValue(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue || '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

async function getCategorySeries(slug: string, page: number): Promise<CategorySeriesResponse> {
  try {
    const apiUrl = getRequiredApiUrl('category series');
    const res = await fetch(`${apiUrl}/series?category=${slug}&limit=24&page=${page}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return { series: [], pagination: null };
    
    const json = await res.json();
    return {
      series: json.data || [],
      pagination: json.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching category series:', error);
    return { series: [], pagination: null };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = getPageValue(pageParam);
  
  const validCategories = ['all', 'thai_dub', 'thai_sub'];
  if (!validCategories.includes(slug)) {
    notFound();
  }

  const { series, pagination } = await getCategorySeries(slug, page);
  
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
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
            {series.map((item) => (
              <SeriesCard key={item._id} series={item} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              {pagination.hasPreviousPage ? (
                <Link
                  href={`/category/${slug}?page=${pagination.page - 1}`}
                  className="rounded-md bg-[#1b1b1d] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  ก่อนหน้า
                </Link>
              ) : (
                <span className="rounded-md bg-[#1b1b1d] px-4 py-2 text-sm font-bold text-[var(--color-text-secondary)] opacity-50">
                  ก่อนหน้า
                </span>
              )}
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                หน้า {pagination.page} / {pagination.totalPages}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={`/category/${slug}?page=${pagination.page + 1}`}
                  className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  ถัดไป
                </Link>
              ) : (
                <span className="rounded-md bg-[#1b1b1d] px-4 py-2 text-sm font-bold text-[var(--color-text-secondary)] opacity-50">
                  ถัดไป
                </span>
              )}
            </div>
          )}
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
