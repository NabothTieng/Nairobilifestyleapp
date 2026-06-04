import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '../App';

interface MobileRegionBarProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function MobileRegionBar({ selectedRegion, onRegionChange }: MobileRegionBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Scroll to selected region when it changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedIndex = REGIONS.indexOf(selectedRegion);
      if (selectedIndex !== -1) {
        const container = scrollContainerRef.current;
        const regionWidth = container.scrollWidth / REGIONS.length;
        container.scrollTo({
          left: selectedIndex * regionWidth,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedRegion]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="px-4 py-5">
        <p className="text-xs text-muted-foreground mb-3 text-center">Select your region</p>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`flex-shrink-0 snap-center px-6 py-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedRegion === region
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
              }`}
              style={{ width: 'calc(50% - 6px)', minHeight: '3rem' }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}