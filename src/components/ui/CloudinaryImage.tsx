"use client";

import Image from "next/image";
import { useState } from "react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function CloudinaryImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  fill = false,
}: CloudinaryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('/placeholder.svg');
  };

  // If it's already a Cloudinary URL, use it as is
  const imageUrl = imgSrc;

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
}