import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Shirt, Timer, PawPrint, Sprout, Sunset, AlertCircle, Sun } from 'lucide-react';
import { RegionSelector } from './components/region-selector';
import { AdviceCard } from './components/advice-card';
import { ThemeToggle } from './components/theme-toggle';
import { MobileRegionBar } from './components/mobile-region-bar';
import { WeatherIcon } from './components/weather-icon';
import { LoadingScreen } from './components/loading-screen';
import { useLoadingState } from './hooks/use-loading-state';

// Import logo correctly
import logo from './components/logo/logo.svg';   // ← Fixed import

export const REGIONS = [
  'Kahawa Sukari', 'Runda', 'Westlands', 'Karen', 'Lavington',
  'Gigiri', 'Kilimani', 'Hurlingham'
];

const regionMapping: Record<string, string> = {
  'Kahawa Sukari': 'kahawa_sukari',
  'Runda': 'runda',
  'Westlands': 'westlands',
  'Karen': 'karen',
  'Lavington': 'lavington',
  'Gigiri': 'gigiri',
  'Kilimani': 'kilimani',
  'Hurlingham': 'hurlingham',
};

function AppContent() {
  const [selectedRegion, setSelectedRegion] = useState('Kahawa Sukari');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoadingState();

  const fetchAdvice = async (displayName: string) => {
    setLoading(true);
    setError(null);
    setIsLoading(true);

    const regionKey = regionMapping[displayName] || 'kahawa_sukari';

    try {
      const res = await fetch(
        `https://vkbbbpcduixpmqaiyklp.supabase.co/functions/v1/get-advice?region=${regionKey}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch data');

      setAdvice(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(selectedRegion);
  }, [selectedRegion]);

  const getUvAdvice = (uvIndex?: number) => {
    if (!uvIndex || uvIndex < 3) return { level: "Low", advice: "Low UV risk today." };
    if (uvIndex >= 8) return { level: "Very High", advice: "Avoid direct sun 10 AM - 4 PM. Use SPF 50+." };
    if (uvIndex >= 6) return { level: "High", advice: "Apply sunscreen generously and seek shade." };
    return { level: "Moderate", advice: "Sunscreen recommended if staying outdoors." };
  };

  const uvAdvice = getUvAdvice(advice?.uv_index);

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-0">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between sm:block">
              <div>
                <h1 className="text-foreground mb-1" style={{ fontFamily: 'var(--font-accent)' }}>
                  Nairobi Lifestyle Advisor
                </h1>
                <p className="text-sm text-muted-foreground">Your daily lifestyle companion</p>
              </div>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <MobileRegionBar selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingScreen />}

        {error && (
          <div className="text-red-500 text-center py-8">
            Error: {error}
          </div>
        )}

        {!loading && !error && advice && (
          <>
            <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
              <WeatherIcon iconUrl={advice.weather_icon} className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{advice.display_name}</span> •{' '}
                  {new Date(advice.date).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current: {advice.current_temp}°C • Feels like: {advice.feels_like}°C
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdviceCard icon={Shirt} title="Dress Advisor" accentColor="primary">
                <div>
                  <p className="font-medium text-foreground mb-2">{advice.dress_advice?.level}</p>
                  <p className="text-sm">{advice.dress_advice?.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {advice.dress_advice?.accessories?.map((acc: string) => (
                      <span key={acc} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </AdviceCard>

              <AdviceCard icon={Timer} title="Run/Walk Windows" accentColor="secondary">
                <div className="space-y-4">
                  <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sunset className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-medium text-foreground">Morning</p>
                    </div>
                    <p className="font-medium text-secondary mb-1">{advice.morning_run?.best_window}</p>
                    <p className="text-xs">{advice.morning_run?.reason}</p>
                  </div>
                  <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sunset className="w-4 h-4 text-accent" />
                      <p className="text-sm font-medium text-foreground">Evening</p>
                    </div>
                    <p className="font-medium text-accent mb-1">{advice.evening_run?.best_window}</p>
                    <p className="text-xs">{advice.evening_run?.reason}</p>
                  </div>
                </div>
              </AdviceCard>

              <AdviceCard icon={PawPrint} title="Pet Activity" accentColor="accent">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Morning Walk</p>
                    <p className="text-sm">{advice.morning_run?.pet_note}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Evening Walk</p>
                    <p className="text-sm">{advice.evening_run?.pet_note}</p>
                  </div>
                </div>
              </AdviceCard>

              <AdviceCard icon={Sprout} title="Garden Care" accentColor="secondary">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Watering</p>
                    <p className="text-sm font-medium text-foreground">{advice.gardening?.watering}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Tips</p>
                    <p className="text-sm">{advice.gardening?.tips}</p>
                  </div>
                </div>
              </AdviceCard>

              <AdviceCard icon={Sun} title="Skin Protection" accentColor="primary">
                <div>
                  <p className="font-medium text-foreground mb-2">
                    UV Index: {advice.uv_index} ({advice.uv_level})
                  </p>
                  <p className="text-sm">{uvAdvice.advice}</p>
                </div>
              </AdviceCard>
            </div>

            <div className="mt-6 bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{advice.security_note}</p>
            </div>
          </>
        )}
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border mt-12 relative overflow-hidden">
        {/* Logo as Background */}
        <div 
          className="absolute inset-0 opacity-9 pointer-events-none"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: '180px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative flex flex-col items-center gap-3 text-center">
          
          
          <p className="text-sm text-muted-foreground">
            © 2026 Nairobi Lifestyle Advisor. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Personalized local intelligence for the {selectedRegion} community.
          </p>
          <p className="text-sm text-muted-foreground">
            Privacy Policy • Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}