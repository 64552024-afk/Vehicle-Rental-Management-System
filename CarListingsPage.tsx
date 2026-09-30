import { useState, useMemo } from 'react';
import { SlidersHorizontal, Car as CarIcon } from 'lucide-react';
import CarCard from '@/components/CarCard';
import type { Car } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/supabase';

type CarListingsPageProps = {
  cars: Car[];
  onRent: (car: Car) => void;
  loading: boolean;
};

export default function CarListingsPage({ cars, onRent, loading }: CarListingsPageProps) {
  const [category, setCategory] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (category !== 'All' && c.category !== category) return false;
      if (transmission !== 'All' && c.transmission !== transmission) return false;
      if (c.daily_price > maxPrice) return false;
      return true;
    });
  }, [cars, category, transmission, maxPrice]);

  const filterButton = (active: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Available Cars</h1>
            <p className="mt-1 text-slate-500">
              {loading ? 'Loading...' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">Filters</h2>

              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => filterButton(category === cat, () => setCategory(cat), cat))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase">Transmission</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Automatic', 'Manual'].map((t) => filterButton(transmission === t, () => setTransmission(t), t))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase">
                  Max Price: <span className="text-blue-600">${maxPrice}/day</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </aside>

          {/* Car Grid */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm ring-1 ring-slate-200/60">
                <CarIcon className="h-12 w-12 text-slate-300" />
                <p className="mt-4 text-lg font-semibold text-slate-700">No cars match your filters</p>
                <p className="mt-1 text-sm text-slate-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} onRent={onRent} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
