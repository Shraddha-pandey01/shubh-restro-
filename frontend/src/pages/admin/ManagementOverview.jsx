import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import useSocketEvent from '../../hooks/useSocketEvent.js';

export const ManagementOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveAlert, setLiveAlert] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Join admin socket channel
    const socket = getSocket();
    socket.emit('join:admin');
  }, []);

  // Listen for real-time socket updates
  useSocketEvent('order:created', (newOrder) => {
    setLiveAlert(`🔔 Incoming Order: ${newOrder.orderNumber} (₹${newOrder.totalAmount.toFixed(2)})`);
    fetchStats();
    setTimeout(() => setLiveAlert(''), 6000);
  });

  useSocketEvent('booking:created', (newBooking) => {
    setLiveAlert(`📅 New Table Booking: ${newBooking.guestName} (${newBooking.numberOfGuests} guests)`);
    fetchStats();
    setTimeout(() => setLiveAlert(''), 6000);
  });

  useSocketEvent('stats:updated', () => {
    fetchStats();
  });

  return (
    <AdminLayout title="Management Overview">
      {/* Live incoming order banner */}
      {liveAlert && (
        <div
          id="admin-live-alert"
          className="mb-8 p-4 bg-primary text-on-primary font-label-caps text-xs tracking-wider flex items-center justify-between border border-black animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base animate-bounce">
              notifications_active
            </span>
            <span className="font-bold">{liveAlert}</span>
          </div>
          <button
            onClick={() => setLiveAlert('')}
            className="text-on-primary hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
          COMPILING EXECUTIVE METRICS...
        </div>
      ) : (
        <div className="space-y-10">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 border-l-4 border-l-primary">
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block mb-1">
                Today's Revenue
              </span>
              <div className="font-headline text-3xl text-on-surface font-bold">
                ₹{stats?.todayRevenue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-[11px] text-on-surface-variant/70 mt-2">
                Lifetime: ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-primary">
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block mb-1">
                Active Kitchen Tickets
              </span>
              <div id="active-orders-metric" className="font-headline text-3xl text-on-surface font-bold">
                {stats?.activeOrdersCount ?? 0}
              </div>
              <div className="text-[11px] text-on-surface-variant/70 mt-2">
                Total Orders: {stats?.totalOrdersCount ?? 0}
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-primary">
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block mb-1">
                Today's Bookings
              </span>
              <div className="font-headline text-3xl text-on-surface font-bold">
                {stats?.todayBookingsCount ?? 0}
              </div>
              <div className="text-[11px] text-on-surface-variant/70 mt-2">
                Tables configured in system
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-primary">
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block mb-1">
                Pending Review Queue
              </span>
              <div className="font-headline text-3xl text-on-surface font-bold">
                {stats?.pendingReviewsCount ?? 0}
              </div>
              <div className="text-[11px] text-on-surface-variant/70 mt-2">
                Requires moderation
              </div>
            </div>
          </div>

          {/* Activity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                <h2 className="font-headline text-lg text-on-surface">Incoming Orders</h2>
                <Link to="/admin/orders" className="font-label-caps text-xs text-primary hover:underline">
                  View All Orders →
                </Link>
              </div>

              {stats?.recentOrders?.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.recentOrders?.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-3 bg-surface-container border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-xs text-primary font-bold">
                          {ord.orderNumber}
                        </div>
                        <div className="text-xs text-on-surface mt-0.5">{ord.guestName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-headline text-xs text-on-surface font-semibold">
                          ₹{ord.totalAmount.toFixed(2)}
                        </div>
                        <span className="text-[10px] font-label-caps px-2 py-0.5 bg-background uppercase text-primary border border-primary/20">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                <h2 className="font-headline text-lg text-on-surface">Recent Reservations</h2>
                <Link to="/admin/reservations" className="font-label-caps text-xs text-primary hover:underline">
                  View All Bookings →
                </Link>
              </div>

              {stats?.recentBookings?.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant">
                  No reservations recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.recentBookings?.map((bkg) => (
                    <div
                      key={bkg._id}
                      className="p-3 bg-surface-container border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-headline text-xs text-on-surface font-semibold">
                          {bkg.guestName} ({bkg.numberOfGuests} guests)
                        </div>
                        <div className="font-mono text-[10px] text-primary mt-0.5">
                          {bkg.referenceId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-on-surface">
                          {bkg.date} @ {bkg.timeSlot}
                        </div>
                        <span
                          className={`text-[10px] font-label-caps px-2 py-0.5 uppercase ${
                            bkg.status === 'confirmed'
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-background text-on-surface-variant'
                          }`}
                        >
                          {bkg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManagementOverview;
