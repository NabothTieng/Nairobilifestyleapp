import { useState } from 'react';
import { Cloud } from 'lucide-react';

interface WeatherIconProps {
  iconUrl: string;
  className?: string;
}

export function WeatherIcon({ iconUrl, className = 'w-5 h-5' }: WeatherIconProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return <Cloud className={`${className} text-primary flex-shrink-0`} />;
  }

  return (
    <div className="relative flex-shrink-0" style={{ width: '3.25rem', height: '3.25rem' }}>
      {isLoading && <Cloud className={`${className} text-primary absolute inset-0`} />}
      <img
        src={iconUrl}
        alt="Weather icon"
        className={`${className} flex-shrink-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity absolute inset-0`}
        style={{
          filter: 'var(--weather-icon-filter, brightness(0) saturate(100%) invert(28%) sepia(83%) saturate(1654%) hue-rotate(8deg) brightness(94%) contrast(95%))',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}