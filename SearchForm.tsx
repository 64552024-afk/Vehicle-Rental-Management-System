import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { LOCATIONS } from '@/lib/supabase';

type SearchFormProps = {
  onSearch: (data: { pickupLocation: string; returnLocation: string; pickupDate: string; returnDate: string }) => void;
  compact?: boolean;
};

export default function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0]);
  const [returnLocation, setReturnLocation] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ pickupLocation, returnLocation, pickupDate, returnDate });
  };

  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition';

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl bg-white shadow-xl ${compact ? 'p-5' : 'p-6'}`}>
      <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-blue-600" /> Pick-up Location
          </label>
          <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputClass}>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-blue-600" /> Return Location
          </label>
          <select value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)} className={inputClass}>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <Calendar className="h-3.5 w-3.5 text-blue-600" /> Pick-up Date
          </label>
          <input type="date" min={today} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <Calendar className="h-3.5 w-3.5 text-blue-600" /> Return Date
          </label>
          <input type="date" min={pickupDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.99]"
      >
        <Search className="h-4 w-4" />
        Search Available Cars
      </button>
    </form>
  );
}
