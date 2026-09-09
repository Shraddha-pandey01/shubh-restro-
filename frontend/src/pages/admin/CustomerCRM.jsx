import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';

export const CustomerCRM = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/customers');
        if (res.success) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.error('Failed to load customer CRM:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const openDetails = async (customerId) => {
    setSelectedCustomerId(customerId);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/admin/customers/${customerId}`);
      if (res.success) {
        setCustomerDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load customer drilldown:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <AdminLayout title="Customer CRM">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="glass-panel p-4 flex justify-between items-center">
          <div className="font-label-caps text-xs text-primary font-semibold">
            {customers.length} Registered Patrons
          </div>
          <div className="text-xs text-on-surface-variant font-mono">
            Total Spend Aggregated: ₹
            {customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0).toFixed(2)}
          </div>
        </div>

        {/* Customer Directory Table */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            COMPILING PATRON REGISTRY...
          </div>
        ) : customers.length === 0 ? (
          <div className="glass-panel p-12 text-center text-on-surface-variant text-xs">
            No registered patrons found.
          </div>
        ) : (
          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high text-primary font-label-caps uppercase border-b border-primary/20">
                <tr>
                  <th className="py-4 px-6">Patron Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6 text-center">Orders</th>
                  <th className="py-4 px-6 text-right">Lifetime Spend</th>
                  <th className="py-4 px-6 text-center">Bookings</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-container transition-colors">
                    <td className="py-4 px-6 font-headline text-sm font-semibold text-on-surface">
                      {c.name}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{c.email}</td>
                    <td className="py-4 px-6 text-on-surface-variant/70">{c.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-center font-bold text-on-surface">
                      {c.totalOrders}
                    </td>
                    <td className="py-4 px-6 text-right font-headline text-primary font-bold">
                      ₹{c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center text-on-surface">
                      {c.totalBookings}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openDetails(c._id)}
                        className="font-label-caps text-[11px] text-primary hover:underline uppercase"
                      >
                        Profile & History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile & History Drilldown Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-2xl w-full glass-panel p-8 relative border-primary animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedCustomerId(null);
                setCustomerDetails(null);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {detailsLoading || !customerDetails ? (
              <div className="py-16 text-center text-primary font-headline animate-pulse">
                RETRIEVING PATRON PORTFOLIO...
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="font-label-caps text-xs text-primary uppercase tracking-widest block">
                    Patron History
                  </span>
                  <h2 className="font-headline text-3xl text-on-surface mt-1">
                    {customerDetails.customer.name}
                  </h2>
                  <div className="text-xs text-on-surface-variant mt-1">
                    {customerDetails.customer.email} • {customerDetails.customer.phone || 'No phone'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container border border-white/5 text-xs">
                  <div>
                    <span className="text-on-surface-variant">Lifetime Spend:</span>
                    <div className="font-headline text-xl text-primary font-bold">
                      ₹{customerDetails.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">Total Orders:</span>
                    <div className="font-headline text-xl text-on-surface font-bold">
                      {customerDetails.totalOrders}
                    </div>
                  </div>
                </div>

                {/* Orders section */}
                <div>
                  <h3 className="font-headline text-base text-on-surface border-b border-primary/20 pb-2 mb-3">
                    Orders History ({customerDetails.orders.length})
                  </h3>
                  {customerDetails.orders.length === 0 ? (
                    <div className="text-xs text-on-surface-variant italic">No orders recorded.</div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {customerDetails.orders.map((ord) => (
                        <div key={ord._id} className="p-2 bg-surface-container text-xs flex justify-between">
                          <div>
                            <span className="font-mono text-primary font-bold">{ord.orderNumber}</span>
                            <div className="text-[10px] text-on-surface-variant/70">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-headline text-on-surface font-semibold">
                              ₹{ord.totalAmount.toFixed(2)}
                            </div>
                            <span className="text-[10px] uppercase text-primary">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reservations section */}
                <div>
                  <h3 className="font-headline text-base text-on-surface border-b border-primary/20 pb-2 mb-3">
                    Reservations History ({customerDetails.bookings.length})
                  </h3>
                  {customerDetails.bookings.length === 0 ? (
                    <div className="text-xs text-on-surface-variant italic">No table bookings recorded.</div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {customerDetails.bookings.map((bkg) => (
                        <div key={bkg._id} className="p-2 bg-surface-container text-xs flex justify-between">
                          <div>
                            <span className="font-mono text-primary font-bold">{bkg.referenceId}</span>
                            <div className="text-[10px] text-on-surface-variant">
                              {bkg.date} at {bkg.timeSlot} • {bkg.numberOfGuests} Guests
                            </div>
                          </div>
                          <span className="text-[10px] font-label-caps uppercase text-primary self-center">
                            {bkg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CustomerCRM;
