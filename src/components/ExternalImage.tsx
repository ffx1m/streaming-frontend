'use client';

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';

type ExternalImageProps = Omit<ImageProps, 'alt' | 'loader' | 'src' | 'unoptimized'> & {
  alt: string;
  fallbackSrc?: string;
  src?: string | null;
};

const fallbackPosterUrl = 'https://placehold.co/300x400/1C1C1E/FFFFFF?text=No+Image';

function passthroughLoader({ src }: ImageLoaderProps) {
  return src;
}

export default function ExternalImage({ src, fallbackSrc = fallbackPosterUrl, alt, ...props }: ExternalImageProps) {
  const imageSrc = src?.trim() || fallbackSrc;

  return (
    <Image
      {...props}
      alt={alt}
      loader={passthroughLoader}
      src={imageSrc}
      unoptimized
    />
  );
}
