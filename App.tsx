import { useState, useEffect, useCallback } from 'react';
import { supabase, type Car, type Booking, type BookingWithCar } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CarListingsPage from '@/pages/CarListingsPage';
import CarDetailsPage from '@/pages/CarDetailsPage';
import CustomerDashboard from '@/pages/CustomerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';

type Page = 'home' | 'cars' | 'details' | 'dashboard' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<BookingWithCar[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchCars = useCallback(async () => {
    setLoadingCars(true);
    const { data, error } = await supabase.from('cars').select('*').order('daily_price', { ascending: true });
    if (!error && data) setCars(data as Car[]);
    setLoadingCars(false);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, car:cars(*)')
      .order('created_at', { ascending: false });
    if (!error && data) setBookings(data as BookingWithCar[]);
    setLoadingBookings(false);
  }, []);

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, [fetchCars, fetchBookings]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    navigate('cars');
  };

  const handleRent = (car: Car) => {
    setSelectedCar(car);
    navigate('details');
  };

  const handleBook = async (booking: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<boolean> => {
    const { error } = await supabase.from('bookings').insert(booking);
    if (error) return false;
    fetchBookings();
    return true;
  };

  const handleCancelBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (!error) fetchBookings();
  };

  const handleAddCar = async (car: Omit<Car, 'id' | 'created_at'>): Promise<boolean> => {
    const { error } = await supabase.from('cars').insert(car);
    if (error) return false;
    fetchCars();
    return true;
  };

  const handleUpdateCar = async (id: string, updates: Partial<Car>): Promise<boolean> => {
    const { error } = await supabase.from('cars').update(updates).eq('id', id);
    if (error) return false;
    fetchCars();
    return true;
  };

  const handleDeleteCar = async (id: string) => {
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (!error) fetchCars();
  };

  const handleToggleAvailability = async (car: Car) => {
    const { error } = await supabase.from('cars').update({ available: !car.available }).eq('id', car.id);
    if (!error) fetchCars();
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) fetchBookings();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header currentPage={page === 'details' ? 'cars' : page} onNavigate={navigate} />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage onSearch={handleSearch} cars={cars} onBrowseAll={() => navigate('cars')} />
        )}
        {page === 'cars' && (
          <CarListingsPage cars={cars} onRent={handleRent} loading={loadingCars} />
        )}
        {page === 'details' && selectedCar && (
          <CarDetailsPage
            car={selectedCar}
            onBack={() => navigate('cars')}
            onBook={handleBook}
          />
        )}
        {page === 'dashboard' && (
          <CustomerDashboard
            bookings={bookings}
            onCancel={handleCancelBooking}
            loading={loadingBookings}
          />
        )}
        {page === 'admin' && (
          <AdminDashboard
            cars={cars}
            bookings={bookings}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
            onDeleteCar={handleDeleteCar}
            onToggleAvailability={handleToggleAvailability}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            loading={loadingCars || loadingBookings}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
