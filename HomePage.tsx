import { Shield, Zap, Headset, Star } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import type { Car } from '@/lib/supabase';

type HomePageProps = {
  onSearch: (data: { pickupLocation: string; returnLocation: string; pickupDate: string; returnDate: string }) => void;
  cars: Car[];
  onBrowseAll: () => void;
};

export default function HomePage({ onSearch, cars, onBrowseAll }: HomePageProps) {
  const features = [
    { icon: Shield, title: 'Fully Insured', desc: 'All rentals include comprehensive insurance coverage for peace of mind.' },
    { icon: Zap, title: 'Instant Booking', desc: 'Reserve your vehicle in minutes with our streamlined booking process.' },
    { icon: Headset, title: '24/7 Support', desc: 'Our customer service team is available around the clock to assist you.' },
    { icon: Star, title: 'Premium Fleet', desc: 'Choose from a curated selection of well-maintained, late-model vehicles.' },
  ];

  const featuredCars = cars.filter((c) => c.available).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/18029637/pexels-photo-18029637.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600"
            alt="Luxury cars"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Drive in Style,<br />Rent with Confidence
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Welcome to DriveLux — your premier car rental destination. Choose from our
              extensive fleet of luxury sedans, rugged SUVs, sporty convertibles, and
              eco-friendly electric vehicles. Book in minutes, drive with confidence.
            </p>
          </div>

          <div className="mt-10">
            <SearchForm onSearch={onSearch} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <f.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featuredCars.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Vehicles</h2>
                <p className="mt-2 text-slate-500">Discover our most popular rental choices</p>
              </div>
              <button
                onClick={onBrowseAll}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View All Cars
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <div key={car.id} className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60">
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">{car.brand} {car.model}</h3>
                    <p className="text-sm text-slate-500">{car.year} · {car.category}</p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-blue-600">${car.daily_price}<span className="text-sm font-normal text-slate-400">/day</span></span>
                      <button
                        onClick={onBrowseAll}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Hit the Road?</h2>
          <p className="mt-3 text-lg text-blue-100">
            Browse our full fleet and find the perfect vehicle for your next journey.
          </p>
          <button
            onClick={onBrowseAll}
            className="mt-6 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-[0.99]"
          >
            Browse All Cars
          </button>
        </div>
      </section>
    </div>
  );
}
