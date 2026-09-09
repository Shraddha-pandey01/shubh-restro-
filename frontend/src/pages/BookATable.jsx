import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const BookATable = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'lookup'
  const [formData, setFormData] = useState({
    guestName: user?.name || '',
    guestPhone: user?.phone || '',
    guestEmail: user?.email || '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:30',
    numberOfGuests: 2,
    specialRequests: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        guestName: prev.guestName || user.name || '',
        guestPhone: prev.guestPhone || user.phone || '',
        guestEmail: prev.guestEmail || user.email || '',
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Lookup state
  const [lookupRef, setLookupRef] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const timeSlots = [
    '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        numberOfGuests: Number(formData.numberOfGuests),
      };

      const res = await api.post('/bookings', payload);
      if (res.success && res.data) {
        setBookingSuccess(res.data);
      } else {
        setFormError(res.message || 'Unable to complete reservation.');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while submitting reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    setLookupLoading(true);

    try {
      const queryParams = new URLSearchParams({
        referenceId: lookupRef.trim(),
        phone: lookupPhone.trim(),
      });
      const res = await api.get(`/bookings/lookup?${queryParams.toString()}`);
      if (res.success && res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError(res.message || 'No reservation found.');
      }
    } catch (err) {
      setLookupError(err.message || 'Reservation lookup failed.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelReservation = async (bookingId, referenceId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`, { referenceId });
      if (res.success && res.data) {
        setLookupResult(res.data);
      }
    } catch (err) {
      setLookupError(err.message || 'Could not cancel booking.');
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 lg:px-margin-desktop max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Celebrate With Us
          </span>
          <h1 className="font-headline text-3xl md:text-5xl text-on-surface mt-2 mb-4">
            Book Your Dining Experience
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-lg mx-auto font-light leading-relaxed">
            At ShubhRestro, we offer comfortable seating with individual tables and private spaces to suit your group and dining needs.
          </p>

          {/* Toggle between Book and Lookup */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('book')}
              className={`font-label-caps text-xs px-6 py-2.5 uppercase tracking-wider transition-colors ${
                activeTab === 'book'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container border border-primary/20 text-on-surface-variant hover:text-primary'
              }`}
            >
              Book a Table
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`font-label-caps text-xs px-6 py-2.5 uppercase tracking-wider transition-colors ${
                activeTab === 'lookup'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container border border-primary/20 text-on-surface-variant hover:text-primary'
              }`}
            >
              Find Existing Reservation
            </button>
          </div>
        </div>

        {/* Success Confirmation Modal */}
        {bookingSuccess && (
          <div className="glass-panel p-8 md:p-12 text-center my-8 border-primary animate-fadeIn">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">
              task_alt
            </span>
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-1">
              Reservation Confirmed
            </span>
            <h2 className="font-headline text-3xl text-on-surface mb-2">
              We Await Your Presence
            </h2>
            <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto mb-6">
              A private table has been reserved under your name. Please present this reference code upon arrival.
            </p>

            <div
              id="booking-confirmed-ref"
              className="inline-block p-4 bg-surface-container border border-primary/40 font-mono text-xl md:text-2xl text-primary font-bold tracking-widest mb-6"
            >
              {bookingSuccess.referenceId}
            </div>

            <div className="text-xs text-on-surface-variant max-w-sm mx-auto space-y-1 mb-8">
              <div><strong>Guest:</strong> {bookingSuccess.guestName}</div>
              <div><strong>Date & Time:</strong> {bookingSuccess.date} at {bookingSuccess.timeSlot}</div>
              <div><strong>Party Size:</strong> {bookingSuccess.numberOfGuests} Guests</div>
            </div>

            <button
              onClick={() => setBookingSuccess(null)}
              className="font-label-caps text-xs bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-semibold hover:bg-primary-fixed"
            >
              Reserve Another Table
            </button>
          </div>
        )}

        {/* Tab 1: Booking Form */}
        {!bookingSuccess && activeTab === 'book' && (
          <div className="glass-panel p-8 md:p-10">
            {formError && (
              <div className="mb-6 p-4 bg-error/10 border border-error text-error text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Primary Guest Name *
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    id="booking-name-input"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    id="booking-phone-input"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Dining Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="booking-date-input"
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Time Slot *
                  </label>
                  <select
                    name="timeSlot"
                    id="booking-timeslot-select"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-surface text-on-surface">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Guests (Party Size) *
                  </label>
                  <select
                    name="numberOfGuests"
                    id="booking-guests-select"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num} className="bg-surface text-on-surface">
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                  Special Notes & Dietary Allocations
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Anniversary celebration, window table preference, Jain food request..."
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                id="booking-submit-btn"
                disabled={isSubmitting}
                className="w-full font-label-caps text-xs md:text-sm bg-primary text-on-primary py-4 px-6 rounded-none hover:bg-primary-fixed transition-colors font-semibold uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'CONFIRMING AVAILABILITY...' : 'CONFIRM RESERVATION'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Existing Reservation Lookup */}
        {activeTab === 'lookup' && (
          <div className="glass-panel p-8 md:p-10">
            <h2 className="font-headline text-xl text-on-surface mb-4">
              Look Up Your Reservation
            </h2>
            <form onSubmit={handleLookupSubmit} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Reference ID *
                  </label>
                  <input
                    type="text"
                    id="lookup-ref-input"
                    value={lookupRef}
                    onChange={(e) => setLookupRef(e.target.value)}
                    required
                    placeholder="e.g. SHUBH-BKG-240908-AB12"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Phone (Optional for verification)
                  </label>
                  <input
                    type="text"
                    id="lookup-phone-input"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                id="lookup-submit-btn"
                disabled={lookupLoading}
                className="font-label-caps text-xs bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-semibold hover:bg-primary-fixed disabled:opacity-50"
              >
                {lookupLoading ? 'SEARCHING ARCHIVE...' : 'SEARCH RESERVATION'}
              </button>
            </form>

            {lookupError && (
              <div className="p-4 bg-error/10 border border-error text-error text-xs">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div id="lookup-result-card" className="p-6 bg-surface-container border border-primary/30 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span id="lookup-result-ref" className="font-mono text-primary font-bold text-lg">
                    {lookupResult.referenceId}
                  </span>
                  <span
                    className={`font-label-caps text-xs px-3 py-1 uppercase tracking-wider ${
                      lookupResult.status === 'confirmed'
                        ? 'bg-primary text-on-primary'
                        : lookupResult.status === 'cancelled'
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container-high text-primary border border-primary/30'
                    }`}
                  >
                    {lookupResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-on-surface-variant">
                  <div>
                    <span className="text-primary font-semibold">Guest:</span> {lookupResult.guestName}
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Phone:</span> {lookupResult.guestPhone}
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Date & Time:</span> {lookupResult.date} at {lookupResult.timeSlot}
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Party Size:</span> {lookupResult.numberOfGuests} Guests
                  </div>
                </div>

                {lookupResult.status !== 'cancelled' && (
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleCancelReservation(lookupResult._id, lookupResult.referenceId)}
                      className="font-label-caps text-xs text-error border border-error/50 px-4 py-2 hover:bg-error/10 uppercase tracking-wider"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookATable;
