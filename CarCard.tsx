import { Users, Fuel, Settings, Calendar } from 'lucide-react';
import type { Car } from '@/lib/supabase';
import { formatCurrency } from '@/lib/format';

type CarCardProps = {
  car: Car;
  onRent: (car: Car) => void;
};

export default function CarCard({ car, onRent }: CarCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-slate-300/60">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={car.image_url}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {car.category}
        </div>
        {!car.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
            <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{car.brand} {car.model}</h3>
            <p className="text-sm text-slate-500">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(car.daily_price)}</p>
            <p className="text-xs text-slate-400">per day</p>
          </div>
        </div>

        <div className="my-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Fuel className="h-4 w-4 text-slate-400" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{car.year}</span>
          </div>
        </div>

        <button
          onClick={() => onRent(car)}
          disabled={!car.available}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {car.available ? 'Rent Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
