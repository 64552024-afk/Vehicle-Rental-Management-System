import { useState } from 'react';
import { Plus, Pencil, Trash2, X, BarChart3, Car as CarIcon, Calendar, Users, DollarSign } from 'lucide-react';
import type { Car, BookingWithCar } from '@/lib/supabase';
import { CATEGORIES, LOCATIONS } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/format';

type AdminDashboardProps = {
  cars: Car[];
  bookings: BookingWithCar[];
  onAddCar: (car: Omit<Car, 'id' | 'created_at'>) => Promise<boolean>;
  onUpdateCar: (id: string, updates: Partial<Car>) => Promise<boolean>;
  onDeleteCar: (id: string) => Promise<void>;
  onToggleAvailability: (car: Car) => Promise<void>;
  onUpdateBookingStatus: (id: string, status: string) => Promise<void>;
  loading: boolean;
};

type Tab = 'overview' | 'cars' | 'bookings' | 'customers';

export default function AdminDashboard({
  cars, bookings, onAddCar, onUpdateCar, onDeleteCar, onToggleAvailability, onUpdateBookingStatus, loading
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showCarForm, setShowCarForm] = useState(false);

  const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'cars', label: 'Cars', icon: CarIcon },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'customers', label: 'Customers', icon: Users },
  ];

  const totalRevenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.total_cost), 0);
  const activeBookings = bookings.filter((b) => b.status === 'active').length;
  const availableCars = cars.filter((c) => c.available).length;
  const uniqueCustomers = new Set(bookings.map((b) => b.email)).size;

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Active Bookings', value: activeBookings.toString(), icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Available Cars', value: `${availableCars}/${cars.length}`, icon: CarIcon, color: 'text-slate-600 bg-slate-100' },
    { label: 'Customers', value: uniqueCustomers.toString(), icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500">Manage your fleet, bookings, and customers</p>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200/60 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                tab === t.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : tab === 'overview' ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Bookings by Status</h2>
                  <div className="space-y-3">
                    {['active', 'completed', 'cancelled'].map((status) => {
                      const count = bookings.filter((b) => b.status === status).length;
                      const pct = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                      const colors: Record<string, string> = { active: 'bg-blue-500', completed: 'bg-green-500', cancelled: 'bg-red-400' };
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-slate-600">{status}</span>
                            <span className="font-semibold text-slate-900">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full ${colors[status]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Cars by Category</h2>
                  <div className="space-y-3">
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                      const count = cars.filter((c) => c.category === cat).length;
                      const pct = cars.length > 0 ? (count / cars.length) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{cat}</span>
                            <span className="font-semibold text-slate-900">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-slate-700" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'cars' ? (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => { setEditingCar(null); setShowCarForm(true); }}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" /> Add Car
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3 hidden md:table-cell">Category</th>
                      <th className="px-4 py-3">Price/day</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={car.image_url} alt="" className="h-10 w-14 rounded object-cover" loading="lazy" />
                            <div>
                              <p className="font-semibold text-slate-900">{car.brand} {car.model}</p>
                              <p className="text-xs text-slate-400">{car.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-slate-600">{car.category}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(car.daily_price)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onToggleAvailability(car)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition ${
                              car.available
                                ? 'bg-green-50 text-green-700 ring-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 ring-red-200 hover:bg-red-100'
                            }`}
                          >
                            {car.available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setEditingCar(car); setShowCarForm(true); }}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { if (confirm(`Delete ${car.brand} ${car.model}?`)) onDeleteCar(car.id); }}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'bookings' ? (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3 hidden md:table-cell">Vehicle</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Dates</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{b.customer_name}</p>
                        <p className="text-xs text-slate-400">{b.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600">{b.car.brand} {b.car.model}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600">
                        {formatDate(b.pickup_date)} → {formatDate(b.return_date)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(b.total_cost)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value)}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                    <th className="px-4 py-3">Bookings</th>
                    <th className="px-4 py-3">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from(new Set(bookings.map((b) => b.email))).map((email) => {
                    const customerBookings = bookings.filter((b) => b.email === email);
                    const name = customerBookings[0]?.customer_name || '';
                    const phone = customerBookings[0]?.phone || '';
                    const spent = customerBookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_cost), 0);
                    return (
                      <tr key={email} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400">{email}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-slate-600">{phone}</td>
                        <td className="px-4 py-3 text-slate-600">{customerBookings.length}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(spent)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCarForm && (
        <CarFormModal
          car={editingCar}
          onClose={() => setShowCarForm(false)}
          onSave={async (data) => {
            if (editingCar) {
              await onUpdateCar(editingCar.id, data);
            } else {
              await onAddCar(data as Omit<Car, 'id' | 'created_at'>);
            }
            setShowCarForm(false);
          }}
        />
      )}
    </div>
  );
}

type CarFormModalProps = {
  car: Car | null;
  onClose: () => void;
  onSave: (data: Partial<Car>) => Promise<void>;
};

function CarFormModal({ car, onClose, onSave }: CarFormModalProps) {
  const [form, setForm] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || 2024,
    seats: car?.seats || 5,
    transmission: car?.transmission || 'Automatic',
    fuel_type: car?.fuel_type || 'Petrol',
    daily_price: car?.daily_price || 50,
    image_url: car?.image_url || '',
    description: car?.description || '',
    available: car?.available ?? true,
    category: car?.category || 'Sedan',
  });
  const [saving, setSaving] = useState(false);

  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-900">{car ? 'Edit Car' : 'Add New Car'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Brand</label>
              <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Model</label>
              <input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Year</label>
              <input type="number" required value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Seats</label>
              <input type="number" required value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Price/day</label>
              <input type="number" step="0.01" required value={form.daily_price} onChange={(e) => setForm({ ...form, daily_price: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Transmission</label>
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={inputClass}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Fuel Type</label>
              <select value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} className={inputClass}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Image URL</label>
            <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded accent-blue-600" />
            Available for booking
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
