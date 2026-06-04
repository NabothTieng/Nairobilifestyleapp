import { Cloud, Sun, Droplets } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Icon area */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="relative">
            <Sun className="w-12 h-12 text-accent animate-spin" style={{ animationDuration: '8s' }} />
            <Cloud className="w-8 h-8 text-primary absolute -bottom-2 -right-2" />
          </div>
        </div>

        {/* App name */}
        <h1 
          className="text-foreground mb-3" 
          style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem' }}
        >
          Nairobi Lifestyle Advisor
        </h1>
        <p className="text-muted-foreground mb-8">Your daily lifestyle companion</p>

        {/* Loading animation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className="text-sm text-muted-foreground">Loading your personalized advice...</p>

        {/* Decorative elements */}
        <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground/40">
          <Droplets className="w-5 h-5" />
          <Sun className="w-5 h-5" />
          <Cloud className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
