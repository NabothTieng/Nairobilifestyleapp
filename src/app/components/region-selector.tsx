import { MapPin, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { REGIONS } from '../App';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  variant?: 'desktop' | 'mobile';
}

export function RegionSelector({ selectedRegion, onRegionChange, variant = 'desktop' }: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'mobile') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => onRegionChange(region)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              selectedRegion === region
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{selectedRegion}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-20">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => {
                onRegionChange(region);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors text-left"
            >
              <span className={selectedRegion === region ? 'font-medium' : ''}>
                {region}
              </span>
              {selectedRegion === region && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}