import React, { useState } from 'react';
import { Atom } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#111D36] to-[#080D1C] text-[#8DBBFF] p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Atom className="w-10 h-10 opacity-80" />
        <span className="mt-2 text-xs text-[#A9B9D5] text-center">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
