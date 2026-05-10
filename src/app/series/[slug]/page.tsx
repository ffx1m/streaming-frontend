'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faShareNodes, faEye, faListUl } from '@fortawesome/free-solid-svg-icons';
import ExternalImage from '@/components/ExternalImage';
import LanguageBadge from '@/components/LanguageBadge';

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
}

interface SeriesDetails {
  _id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  languageType: 'thai_dub' | 'thai_sub';
  totalEpisodes: number;
  views?: number;
  episodes?: Episode[];
}

function useSeriesDetails(slug: string) {
  const [data, setData] = useState<SeriesDetails | null>(null);
  
  useEffect(() => {
    async function fetchSeries() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/series/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch {
        console.error('Error fetching series details');
      }
    }
    
    fetchSeries();
  }, [slug]);
  
  return data;
}

export default function SeriesDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const series = useSeriesDetails(slug);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canToggleDescription, setCanToggleDescription] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setIsExpanded(false);
    });
  }, [slug]);

  useEffect(() => {
    const descriptionElement = descriptionRef.current;
    if (!descriptionElement || !series?.description) {
      queueMicrotask(() => {
        setCanToggleDescription(false);
      });
      return;
    }

    let frameId = 0;
    const measureDescription = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const lineHeight = Number.parseFloat(window.getComputedStyle(descriptionElement).lineHeight);
        if (!lineHeight) return;

        const collapsedLines = window.matchMedia('(min-width: 640px)').matches ? 3 : 2;
        const collapsedHeight = lineHeight * collapsedLines;
        const previousDisplay = descriptionElement.style.display;
        const previousOverflow = descriptionElement.style.overflow;
        const previousLineClamp = descriptionElement.style.getPropertyValue('-webkit-line-clamp');
        const previousBoxOrient = descriptionElement.style.getPropertyValue('-webkit-box-orient');

        descriptionElement.style.display = 'block';
        descriptionElement.style.overflow = 'visible';
        descriptionElement.style.setProperty('-webkit-line-clamp', 'unset');
        descriptionElement.style.setProperty('-webkit-box-orient', 'unset');

        const fullHeight = descriptionElement.scrollHeight;

        descriptionElement.style.display = previousDisplay;
        descriptionElement.style.overflow = previousOverflow;
        if (previousLineClamp) {
          descriptionElement.style.setProperty('-webkit-line-clamp', previousLineClamp);
        } else {
          descriptionElement.style.removeProperty('-webkit-line-clamp');
        }
        if (previousBoxOrient) {
          descriptionElement.style.setProperty('-webkit-box-orient', previousBoxOrient);
        } else {
          descriptionElement.style.removeProperty('-webkit-box-orient');
        }

        setCanToggleDescription(fullHeight > collapsedHeight + 2);
      });
    };

    const resizeObserver = new ResizeObserver(measureDescription);
    resizeObserver.observe(descriptionElement);
    window.addEventListener('resize', measureDescription);
    measureDescription();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', measureDescription);
      resizeObserver.disconnect();
    };
  }, [series?.description]);

  if (!series) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-[var(--color-text-secondary)]">
        Loading...
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: series.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Copied to clipboard');
    }
  };

  const chunkSize = 20;
  const episodes = series.episodes || [];
  const totalEpisodes = episodes.length;
  const hasEpisodes = totalEpisodes > 0;
  const numTabs = Math.ceil(totalEpisodes / chunkSize);
  const displayedEpisodes = episodes.slice(currentTab * chunkSize, (currentTab + 1) * chunkSize);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8">
        <div className="mx-auto w-full max-w-[240px] md:mx-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d] shadow-lg">
            <ExternalImage src={series.posterUrl} alt={series.title} fill sizes="240px" className="object-cover" />
            <LanguageBadge languageType={series.languageType} className="absolute left-2 top-2 text-xs" />
          </div>
        </div>
        
        <div className="flex min-w-0 flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{series.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faListUl} className="h-4 w-4" />
              <span>{series.totalEpisodes} ตอน</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
              <span>{series.views?.toLocaleString() ?? 0} วิว</span>
            </span>
          </div>

          <div className="space-y-1">
            <p
              ref={descriptionRef}
              className={`text-sm leading-7 text-[#EBEBF5] md:text-base ${!isExpanded && canToggleDescription ? 'line-clamp-2 sm:line-clamp-3' : ''}`}
            >
              {series.description}
            </p>
            {canToggleDescription && (
              <button 
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-bold text-[var(--color-primary)] hover:underline"
              >
                {isExpanded ? 'ย่อรายละเอียด' : 'รายละเอียดเพิ่มเติม'}
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {hasEpisodes ? (
              <Link 
                href={`/watch/${series.slug}/1`}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition-colors hover:bg-blue-600 md:flex-none"
              >
                <FontAwesomeIcon icon={faPlay} />
                <span>เข้าชมตอนแรก</span>
              </Link>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-md border border-white/10 bg-[#1b1b1d] px-5 py-3 text-sm font-bold text-[var(--color-text-secondary)] md:flex-none">
                ยังไม่มีตอนให้รับชม
              </div>
            )}
            <button 
              type="button"
              aria-label="แชร์ซีรีส์"
              onClick={handleShare}
              className="flex items-center justify-center rounded-md bg-[#1b1b1d] px-4 py-3 text-white transition-colors hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">รายชื่อตอนทั้งหมด</h2>
        
        {numTabs > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array(numTabs).fill(null).map((_, idx) => {
              const startEp = idx * chunkSize + 1;
              const endEp = Math.min((idx + 1) * chunkSize, totalEpisodes);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentTab(idx)}
                  className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                    currentTab === idx
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[#1b1b1d] text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  ตอนที่ {startEp} - {endEp}
                </button>
              );
            })}
          </div>
        )}

        {hasEpisodes ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {displayedEpisodes.map((ep) => (
              <Link 
                key={ep._id} 
                href={`/watch/${series.slug}/${ep.episodeNumber}`}
                className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-[#1b1b1d] py-4 transition-colors hover:border-[var(--color-primary)]/60 hover:bg-white/5"
              >
                <span className="text-lg font-bold">{ep.episodeNumber}</span>
                <span className="mt-1 line-clamp-1 px-2 text-xs text-[var(--color-text-secondary)]">{ep.title}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            ตอนของซีรีส์นี้ยังไม่ถูกเพิ่มเข้าระบบ
          </div>
        )}
      </section>
    </div>
  );
}
