import Link from 'next/link';
import { Home, Utensils, Camera, FileText, User } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 flex justify-between items-center md:hidden z-50">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
        <Home size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/meal-planner" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
        <Utensils size={20} />
        <span className="text-[10px] font-medium">Meals</span>
      </Link>
      <Link href="/food-scanner" className="flex flex-col items-center gap-1 text-primary bg-primary/10 p-3 rounded-full -translate-y-6 shadow-lg border-4 border-background transition-transform active:scale-95">
        <Camera size={24} />
      </Link>
      <Link href="/lab-reports" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
        <FileText size={20} />
        <span className="text-[10px] font-medium">Labs</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
        <User size={20} />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </nav>
  );
}