import { Car, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DriveLux</span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium car rental service offering a wide range of vehicles for every journey.
              Quality cars, competitive prices, and exceptional service.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>support@drivelux.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>123 Downtown Avenue, New York</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Mon - Fri</span><span>8:00 - 20:00</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>9:00 - 18:00</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>10:00 - 16:00</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm">
          <p>&copy; 2026 DriveLux Car Rental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
