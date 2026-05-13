'use client';

import { useState, useEffect } from 'react';
import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '@/lib/api';

// Mock hook for debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<SeriesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const hasQuery = debouncedQuery.trim().length > 0;

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return;
    }

    let cancelled = false;
    
    async function searchSeries() {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/series?search=${encodeURIComponent(debouncedQuery)}&limit=18`);
        if (cancelled) return;

        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Search error:', error);
        setResults([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      searchSeries();
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">ค้นหาซีรีส์</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">พิมพ์ชื่อเรื่องที่ต้องการค้นหา</p>
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <FontAwesomeIcon icon={faSearch} className="text-[var(--color-text-secondary)]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อซีรีส์..."
          className="w-full rounded-lg border border-white/10 bg-[#1b1b1d] py-4 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[var(--color-primary)]" />
          </div>
        )}
      </div>

      {!hasQuery && (
        <div className="mx-auto max-w-2xl rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
          เริ่มค้นหาด้วยชื่อซีรีส์ ภาษาไทยหรืออังกฤษก็ได้
        </div>
      )}

      {hasQuery && !loading && results.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-10 text-center text-[var(--color-text-secondary)]">
          ไม่พบผลลัพธ์สำหรับ <span className="font-semibold text-white">{debouncedQuery}</span>
        </div>
      )}

      {hasQuery && results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">ผลการค้นหา</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
            {results.map((item) => (
              <SeriesCard key={item._id} series={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
