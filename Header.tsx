import { Car } from 'lucide-react';

type Page = 'home' | 'cars' | 'dashboard' | 'admin';

type HeaderProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems: { key: Page; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'cars', label: 'Browse Cars' },
    { key: 'dashboard', label: 'My Bookings' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DriveLux</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                  currentPage === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
