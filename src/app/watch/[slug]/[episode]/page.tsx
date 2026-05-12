'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faListUl, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
}

interface WatchData {
  seriesId: string;
  title: string;
  slug: string;
  posterUrl?: string;
  totalEpisodes: number;
  currentEpisodeId: string | null;
  currentEpisodeUrl: string;
  hasCurrentEpisode: boolean;
}

interface WatchHistoryItem {
  slug: string;
  title: string;
  posterUrl: string;
  lastWatchedEpisode: number;
  totalEpisodes: number;
  progressPercentage: number;
  timestamp: number;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const episode = parseInt(params.episode as string) || 1;
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackedRef = useRef(false);
  
  const [seriesData, setSeriesData] = useState<WatchData | null>(null);
  const [missingSeries, setMissingSeries] = useState(false);

  useEffect(() => {
    trackedRef.current = false;

    async function fetchSeriesDetails() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/series/${slug}`);

        if (!res.ok) {
          setMissingSeries(true);
          return;
        }

        const json = await res.json();
        const data = json.data;
        const episodes = (data.episodes || []) as Episode[];
        const currentEp = episodes.find((ep) => ep.episodeNumber === episode);
        
        setSeriesData({
          seriesId: data._id,
          title: data.title,
          slug: data.slug,
          posterUrl: data.posterUrl,
          totalEpisodes: episodes.length,
          currentEpisodeId: currentEp ? currentEp._id : null,
          currentEpisodeUrl: currentEp ? currentEp.videoUrl : '',
          hasCurrentEpisode: Boolean(currentEp),
        });
      } catch {
        console.error('Error fetching watch data');
        setMissingSeries(true);
      }
    }
    
    fetchSeriesDetails();
  }, [slug, episode]);

  useEffect(() => {
    if (!seriesData || !seriesData.hasCurrentEpisode || !seriesData.currentEpisodeId) return;
    
    // Check if this episode has already been tracked in this session
    const sessionKey = `viewed_${seriesData.seriesId}_${seriesData.currentEpisodeId}`;
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey);

    let timer: NodeJS.Timeout;

    if (!trackedRef.current && !alreadyTrackedInSession) {
      // Delay tracking by 10 seconds to ensure the user is actually watching
      timer = setTimeout(() => {
        trackedRef.current = true;
        sessionStorage.setItem(sessionKey, 'true');
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/series/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            seriesId: seriesData.seriesId, 
            episodeId: seriesData.currentEpisodeId 
          })
        }).catch(() => console.error('Tracking error'));
      }, 10000); // 10 seconds delay
    }
    
    // Update local watch history
    const historyStr = localStorage.getItem('watchHistory') || '[]';
    let history: WatchHistoryItem[] = [];
    try {
      history = JSON.parse(historyStr);
    } catch {}

    const existingIndex = history.findIndex((item) => item.slug === slug);
    const newEntry: WatchHistoryItem = {
      slug,
      title: seriesData.title,
      posterUrl: seriesData.posterUrl || 'https://placehold.co/300x400/2C2C2E/8E8E93?text=Cover',
      lastWatchedEpisode: episode,
      totalEpisodes: seriesData.totalEpisodes,
      progressPercentage: Math.round((episode / Math.max(seriesData.totalEpisodes, 1)) * 100),
      timestamp: new Date().getTime(),
    };

    if (existingIndex > -1) {
      history[existingIndex] = newEntry;
    } else {
      history.unshift(newEntry);
    }

    localStorage.setItem('watchHistory', JSON.stringify(history.slice(0, 10)));

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [seriesData, episode, slug]);

  useEffect(() => {
    if (!seriesData?.hasCurrentEpisode) return;

    setTimeout(() => {
      const activeEl = document.getElementById('active-episode');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }, [seriesData, episode]);

  const handleVideoEnded = () => {
    if (seriesData && episode < seriesData.totalEpisodes) {
      router.push(`/watch/${slug}/${episode + 1}`);
    }
  };

  if (!seriesData && !missingSeries) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading...</div>;
  }

  if (missingSeries || !seriesData || !seriesData.hasCurrentEpisode) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">ตอนนี้ยังไม่พร้อมรับชม</h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            อาจยังไม่มีตอนนี้ในระบบ หรือวิดีโอยังไม่ได้ถูกเพิ่ม
          </p>
          <Link href={`/series/${slug}`} className="mt-6 inline-flex rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600">
            กลับไปหน้าซีรีส์
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-5 px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black sm:rounded-lg sm:border sm:border-white/10">
        <video 
          ref={videoRef}
          controls 
          className="h-full w-full object-contain"
          src={seriesData.currentEpisodeUrl}
          onEnded={handleVideoEnded}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="space-y-5 px-4 sm:px-0">
        <Link href={`/series/${slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>กลับไปหน้าซีรีส์</span>
        </Link>
        
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{seriesData.title}</h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">ตอนที่ {episode}</p>
          </div>
          
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {episode > 1 && (
              <Link 
                href={`/watch/${slug}/${episode - 1}`}
                className="flex items-center gap-2 rounded-md bg-[#1b1b1d] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>ตอนก่อนหน้า</span>
              </Link>
            )}
            
            {episode < seriesData.totalEpisodes && (
              <Link 
                href={`/watch/${slug}/${episode + 1}`}
                className="ml-auto flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600 sm:ml-0"
              >
                <span>ตอนถัดไป</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            )}
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <FontAwesomeIcon icon={faListUl} />
            <span>ตอนอื่นๆ</span>
          </h2>
          
          <div className="flex snap-x gap-3 overflow-x-auto pb-4">
            {Array(seriesData.totalEpisodes).fill(null).map((_, i) => (
              <Link 
                key={i}
                id={episode === i + 1 ? 'active-episode' : undefined}
                href={`/watch/${slug}/${i + 1}`}
                className={`snap-center shrink-0 rounded-md border px-6 py-3 font-bold transition-colors ${
                  episode === i + 1 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                    : 'border-white/10 bg-[#1b1b1d] hover:bg-white/10'
                }`}
              >
                ตอน {i + 1}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
