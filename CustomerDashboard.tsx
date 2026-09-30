import { useState } from 'react';
import { Calendar, MapPin, Car as CarIcon, X, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { BookingWithCar } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/format';

type CustomerDashboardProps = {
  bookings: BookingWithCar[];
  onCancel: (id: string) => void;
  loading: boolean;
};

export default function CustomerDashboard({ bookings, onCancel, loading }: CustomerDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [selected, setSelected] = useState<BookingWithCar | null>(null);

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-blue-50 text-blue-700 ring-blue-200',
      completed: 'bg-green-50 text-green-700 ring-green-200',
      cancelled: 'bg-red-50 text-red-600 ring-red-200',
    };
    const icons: Record<string, typeof Clock> = {
      active: Clock,
      completed: CheckCircle2,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.active}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: bookings.length },
    { key: 'active', label: 'Active', count: bookings.filter((b) => b.status === 'active').length },
    { key: 'completed', label: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-1 text-slate-500">View and manage your rental reservations</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
            <p className="text-xs text-slate-500">Total Bookings</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <p className="text-2xl font-bold text-blue-600">{bookings.filter((b) => b.status === 'active').length}</p>
            <p className="text-xs text-slate-500">Active Rentals</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <p className="text-2xl font-bold text-green-600">{bookings.filter((b) => b.status === 'completed').length}</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`relative px-4 py-3 text-sm font-semibold transition ${
                filter === tab.key ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label} ({tab.count})
              {filter === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm ring-1 ring-slate-200/60">
              <CarIcon className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-semibold text-slate-700">No bookings found</p>
              <p className="mt-1 text-sm text-slate-400">Your rental history will appear here</p>
            </div>
          ) : (
            filtered.map((booking) => (
              <div key={booking.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="h-40 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-slate-100">
                    <img src={booking.car.image_url} alt={`${booking.car.brand} ${booking.car.model}`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{booking.car.brand} {booking.car.model}</h3>
                        <p className="text-sm text-slate-500">{booking.car.year} · {booking.car.category}</p>
                      </div>
                      {statusBadge(booking.status)}
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{formatDate(booking.pickup_date)} → {formatDate(booking.return_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{booking.pickup_location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(booking.total_cost)}</span>
                        <span className="text-xs text-slate-400 ml-1">total</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(booking)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </button>
                        {booking.status === 'active' && (
                          <button
                            onClick={() => onCancel(booking.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-48 overflow-hidden rounded-t-2xl bg-slate-100">
              <img src={selected.car.image_url} alt={`${selected.car.brand} ${selected.car.model}`} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.car.brand} {selected.car.model}</h2>
                  <p className="text-sm text-slate-500">{selected.car.year}</p>
                </div>
                {statusBadge(selected.status)}
              </div>

              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Customer</span><span className="font-semibold text-slate-900">{selected.customer_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-semibold text-slate-900">{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-semibold text-slate-900">{selected.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Pick-up</span><span className="font-semibold text-slate-900">{formatDate(selected.pickup_date)} · {selected.pickup_location}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Return</span><span className="font-semibold text-slate-900">{formatDate(selected.return_date)} · {selected.return_location}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Booked on</span><span className="font-semibold text-slate-900">{formatDate(selected.created_at.split('T')[0])}</span></div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-lg font-semibold text-slate-700">Total Cost</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(selected.total_cost)}</span>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
