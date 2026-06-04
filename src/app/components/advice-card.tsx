import { LucideIcon } from 'lucide-react';

interface AdviceCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  accentColor?: 'primary' | 'secondary' | 'accent';
}

export function AdviceCard({ icon: Icon, title, children, accentColor = 'primary' }: AdviceCardProps) {
  const accentColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${accentColors[accentColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-card-foreground">{title}</h3>
      </div>
      <div className="space-y-3 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
