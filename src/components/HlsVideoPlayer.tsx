'use client';

import Hls from 'hls.js';
import { useEffect, useMemo, useRef, useState } from 'react';

type HlsVideoPlayerProps = {
  src: string;
  className?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
};

function isHlsUrl(src: string) {
  try {
    return new URL(src, window.location.href).pathname.toLowerCase().endsWith('.m3u8');
  } catch {
    return src.toLowerCase().includes('.m3u8');
  }
}

export default function HlsVideoPlayer({ src, className, onEnded, onTimeUpdate }: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fatalPlaybackError, setFatalPlaybackError] = useState<{ src: string; message: string } | null>(null);
  const unsupportedHlsMessage = useMemo(() => {
    if (!src || typeof document === 'undefined' || !isHlsUrl(src)) return '';
    const probe = document.createElement('video');
    if (probe.canPlayType('application/vnd.apple.mpegurl') || Hls.isSupported()) return '';
    return 'เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ HLS';
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;

    if (!isHlsUrl(src)) {
      video.src = src;
      return undefined;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return undefined;
    }

    if (!Hls.isSupported()) {
      return undefined;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 180,         // เก็บวิดีโอที่ดูไปแล้วไว้ใน RAM 3 นาที (กดย้อนกลับลื่นปรี๊ด)
      maxBufferLength: 180,          // โหลดวิดีโอล่วงหน้าไว้ 3 นาที (ให้จบตอนสำหรับวิดีโอสั้น)
      maxMaxBufferLength: 300,       // เพดานสูงสุดของการโหลดล่วงหน้า
      maxBufferSize: 90 * 1024 * 1024, // เพิ่มขนาด Buffer ใน RAM เป็น 90MB (ครอบคลุมวิดีโอ 1080p ทั้งตอน)
      startLevel: 0,                 // เริ่มต้นที่ความละเอียดต่ำสุดเพื่อความเร็วในการเปิดติด (Instant Start)
      abrEwmaDefaultEstimate: 5000000, // ประเมินเน็ตเริ่มต้นไว้ที่ 5Mbps เพื่อให้ขยับมาชัดเร็วขึ้น
    });

    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        setFatalPlaybackError({ src, message: 'ไม่สามารถโหลดวิดีโอได้' });
        hls.destroy();
      }
    });

    return () => {
      hls.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        controls
        playsInline
        className={className}
        onEnded={onEnded}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          onTimeUpdate?.(video.currentTime, video.duration);
        }}
      >
        Your browser does not support the video tag.
      </video>
      {(unsupportedHlsMessage || (fatalPlaybackError?.src === src ? fatalPlaybackError.message : '')) && (
        <div className="absolute inset-x-4 bottom-4 rounded-md border border-red-500/40 bg-black/80 px-4 py-3 text-center text-sm font-semibold text-red-200">
          {unsupportedHlsMessage || fatalPlaybackError?.message}
        </div>
      )}
    </>
  );
}
