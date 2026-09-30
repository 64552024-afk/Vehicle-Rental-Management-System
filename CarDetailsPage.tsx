import { useState } from 'react';
import { ArrowLeft, Users, Fuel, Settings, Calendar, CheckCircle2, Car as CarIcon, MapPin } from 'lucide-react';
import type { Car, Booking } from '@/lib/supabase';
import { LOCATIONS } from '@/lib/supabase';
import { formatCurrency, formatDate, daysBetween } from '@/lib/format';

type CarDetailsPageProps = {
  car: Car;
  onBack: () => void;
  onBook: (booking: Omit<Booking, 'id' | 'created_at' | 'status'>) => Promise<boolean>;
};

export default function CarDetailsPage({ car, onBack, onBook }: CarDetailsPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0]);
  const [returnLocation, setReturnLocation] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const days = daysBetween(pickupDate, returnDate);
  const totalCost = days * car.daily_price;

  const specs = [
    { icon: Users, label: 'Seats', value: `${car.seats}` },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type },
    { icon: Calendar, label: 'Year', value: `${car.year}` },
  ];

  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const success = await onBook({
      customer_name: customerName,
      email,
      phone,
      car_id: car.id,
      pickup_location: pickupLocation,
      return_location: returnLocation,
      pickup_date: pickupDate,
      return_date: returnDate,
      total_cost: totalCost,
    });
    setSubmitting(false);
    if (success) {
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Unable to complete your booking. Please try again.');
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200/60 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
            <p className="mt-3 text-slate-600">
              Thank you, {customerName}. Your reservation for the {car.brand} {car.model} has been confirmed.
              A confirmation email has been sent to {email}.
            </p>

            <div className="mt-8 rounded-xl bg-slate-50 p-6 text-left">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">Booking Summary</h2>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-400">Vehicle</p>
                  <p className="font-semibold text-slate-900">{car.brand} {car.model} ({car.year})</p>
                </div>
                <div>
                  <p className="text-slate-400">Pick-up</p>
                  <p className="font-semibold text-slate-900">{formatDate(pickupDate)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Return</p>
                  <p className="font-semibold text-slate-900">{formatDate(returnDate)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Duration</p>
                  <p className="font-semibold text-slate-900">{days} day{days !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-slate-400">Pick-up Location</p>
                  <p className="font-semibold text-slate-900">{pickupLocation}</p>
                </div>
                <div>
                  <p className="text-slate-400">Return Location</p>
                  <p className="font-semibold text-slate-900">{returnLocation}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-700">Total Cost</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Cars
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image & Specs */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/60">
              <div className="h-72 overflow-hidden bg-slate-100">
                <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{car.brand} {car.model}</h1>
                    <p className="text-sm text-slate-500">{car.year} · {car.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(car.daily_price)}</p>
                    <p className="text-xs text-slate-400">per day</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">{car.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <spec.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{spec.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  {car.available ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">Available for booking</span>
                    </>
                  ) : (
                    <>
                      <CarIcon className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">Currently unavailable</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/60">
              <h2 className="text-xl font-bold text-slate-900">Book This Vehicle</h2>
              <p className="mt-1 text-sm text-slate-500">Fill in your details to reserve this car.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase">Full Name</label>
                  <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} placeholder="John Smith" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="john@email.com" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase">Phone</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="555-0100" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase"><MapPin className="h-3 w-3" /> Pick-up Location</label>
                    <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputClass}>
                      {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase"><MapPin className="h-3 w-3" /> Return Location</label>
                    <select value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)} className={inputClass}>
                      {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase">Pick-up Date</label>
                    <input type="date" required min={today} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase">Return Date</label>
                    <input type="date" required min={pickupDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={inputClass} />
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{formatCurrency(car.daily_price)} × {days} day{days !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totalCost)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-lg font-bold text-slate-700">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !car.available}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? 'Processing...' : 'Book Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
