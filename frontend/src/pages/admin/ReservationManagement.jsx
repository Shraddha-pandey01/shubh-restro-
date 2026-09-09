import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import useSocketEvent from '../../hooks/useSocketEvent.js';

export const ReservationManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (dateFilter) queryParams.append('date', dateFilter);

      const res = await api.get(`/bookings?${queryParams.toString()}`);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const socket = getSocket();
    socket.emit('join:admin');
  }, [statusFilter, dateFilter]);

  useSocketEvent('booking:created', (newBooking) => {
    setBookings((prev) => [newBooking, ...prev.filter((b) => b._id !== newBooking._id)]);
  });

  useSocketEvent('booking:status_changed', (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
    );
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.success && res.data) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? res.data : b))
        );
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <AdminLayout title="Reservation Management">
      <div className="space-y-6">
        {/* Filter controls */}
        <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`font-label-caps text-xs px-4 py-2 uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-label-caps">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-surface-container border-b border-primary/30 text-on-surface text-xs px-3 py-1.5 focus:outline-none"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-[11px] text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            LOADING RESERVATION LOGS...
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-12 text-center text-on-surface-variant text-xs">
            No table bookings found matching your filter criteria.
          </div>
        ) : (
          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high text-primary font-label-caps uppercase border-b border-primary/20">
                <tr>
                  <th className="py-4 px-6">Ref Code</th>
                  <th className="py-4 px-6">Guest Name</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Party Size</th>
                  <th className="py-4 px-6">Table</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((bkg) => (
                  <tr key={bkg._id} className="hover:bg-surface-container transition-colors">
                    <td className="py-4 px-6 font-mono text-primary font-bold">
                      {bkg.referenceId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-on-surface font-semibold">{bkg.guestName}</div>
                      <div className="text-[11px] text-on-surface-variant/70">{bkg.guestPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-on-surface">{bkg.date}</div>
                      <div className="text-primary font-headline font-semibold">{bkg.timeSlot}</div>
                    </td>
                    <td className="py-4 px-6">
                      {bkg.numberOfGuests} {bkg.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {bkg.tableId ? `Table ${bkg.tableId.tableNumber} (${bkg.tableId.location})` : 'Unassigned'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-label-caps text-[10px] px-2.5 py-1 uppercase tracking-wider inline-block ${
                          bkg.status === 'confirmed'
                            ? 'bg-primary text-on-primary font-bold'
                            : bkg.status === 'cancelled'
                            ? 'bg-error text-on-error'
                            : 'bg-surface-container text-primary border border-primary/30'
                        }`}
                      >
                        {bkg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {bkg.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(bkg._id, 'confirmed')}
                          className="font-label-caps text-[10px] bg-primary text-on-primary px-3 py-1 hover:bg-primary-fixed uppercase"
                        >
                          Confirm
                        </button>
                      )}
                      {bkg.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(bkg._id, 'cancelled')}
                          className="font-label-caps text-[10px] text-error hover:underline uppercase"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBooking(bkg)}
                        className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary uppercase"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 relative border-primary animate-fadeIn">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <span className="font-mono text-primary font-bold text-sm tracking-widest block mb-1">
              {selectedBooking.referenceId}
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-4">
              Reservation Detail
            </h2>

            <div className="space-y-3 text-xs text-on-surface-variant border-t border-b border-primary/20 py-4">
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="text-on-surface font-semibold">{selectedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="text-on-surface">{selectedBooking.guestPhone}</span>
              </div>
              {selectedBooking.guestEmail && (
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-on-surface">{selectedBooking.guestEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="text-primary font-semibold">{selectedBooking.date} at {selectedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span>Party Size:</span>
                <span className="text-on-surface">{selectedBooking.numberOfGuests} Guests</span>
              </div>
              {selectedBooking.specialRequests && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-primary font-semibold block mb-1">Special Notes:</span>
                  <p className="italic text-on-surface">"{selectedBooking.specialRequests}"</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="font-label-caps text-xs bg-primary text-on-primary px-6 py-2.5 uppercase"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ReservationManagement;
