import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const MyAccount = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/bookings/my-bookings'),
        ]);

        if (ordersRes.success) setOrders(ordersRes.data);
        if (bookingsRes.success) setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to load customer account history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 lg:px-margin-desktop max-w-6xl mx-auto w-full">
        {/* Profile Card Header */}
        <div className="glass-panel p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-primary/30">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-surface-container-high border-2 border-primary/40 flex items-center justify-center font-headline text-3xl text-primary font-bold">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase block">
                Patron Profile
              </span>
              <h1 className="font-headline text-2xl md:text-4xl text-on-surface mt-1">
                {user?.name}
              </h1>
              <div className="font-body text-xs text-on-surface-variant mt-1">
                {user?.email} • {user?.phone || 'No phone registered'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/book-a-table"
              className="font-label-caps text-xs bg-primary text-on-primary px-6 py-3 uppercase tracking-wider font-semibold hover:bg-primary-fixed"
            >
              Reserve Table
            </Link>
            <button
              onClick={logout}
              className="font-label-caps text-xs border border-error/50 text-error px-5 py-3 hover:bg-error/10 uppercase tracking-wider"
            >
              Log Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            RETRIEVING ACCOUNT RECORDS...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Orders History */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-primary/20 pb-3">
                <h2 className="font-headline text-xl text-on-surface">Order Timeline</h2>
                <span className="font-label-caps text-xs text-primary">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="glass-panel p-8 text-center text-on-surface-variant text-xs">
                  You have not placed any orders yet.
                  <div className="mt-4">
                    <Link to="/menu" className="font-label-caps text-primary uppercase">
                      Browse Menu →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord._id} className="glass-panel p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm text-primary font-bold">
                            {ord.orderNumber}
                          </div>
                          <div className="text-[11px] text-on-surface-variant/70">
                            {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <span className="font-label-caps text-[10px] px-2.5 py-1 border border-primary/30 uppercase tracking-wider bg-surface-container text-primary capitalize">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-on-surface-variant">
                        {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs">
                        <div className="font-headline text-on-surface font-semibold">
                          Total: ₹{ord.totalAmount.toFixed(2)}
                        </div>
                        <Link
                          to={`/orders/${ord._id}`}
                          className="font-label-caps text-primary hover:underline uppercase text-[11px]"
                        >
                          View Live Status →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Table Reservations History */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-primary/20 pb-3">
                <h2 className="font-headline text-xl text-on-surface">Reservations</h2>
                <span className="font-label-caps text-xs text-primary">
                  {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="glass-panel p-8 text-center text-on-surface-variant text-xs">
                  No table bookings found under this account.
                  <div className="mt-4">
                    <Link to="/book-a-table" className="font-label-caps text-primary uppercase">
                      Reserve Table →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((bkg) => (
                    <div key={bkg._id} className="glass-panel p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm text-primary font-bold">
                            {bkg.referenceId}
                          </div>
                          <div className="text-[11px] text-on-surface-variant/70">
                            Dining: {bkg.date} at {bkg.timeSlot}
                          </div>
                        </div>
                        <span
                          className={`font-label-caps text-[10px] px-2.5 py-1 uppercase tracking-wider ${
                            bkg.status === 'confirmed'
                              ? 'bg-primary text-on-primary font-bold'
                              : bkg.status === 'cancelled'
                              ? 'bg-error text-on-error'
                              : 'bg-surface-container text-primary border border-primary/30'
                          }`}
                        >
                          {bkg.status}
                        </span>
                      </div>

                      <div className="text-xs text-on-surface-variant">
                        Party Size: <strong>{bkg.numberOfGuests} Guests</strong>
                        {bkg.tableId && ` • Table ${bkg.tableId.tableNumber} (${bkg.tableId.location})`}
                      </div>

                      {bkg.specialRequests && (
                        <div className="text-[11px] text-on-surface-variant/60 italic">
                          "{bkg.specialRequests}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
