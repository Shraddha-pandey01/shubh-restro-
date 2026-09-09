import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import useSocketEvent from '../../hooks/useSocketEvent.js';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?status=${statusFilter}`);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();
    socket.emit('join:admin');
  }, [statusFilter]);

  // Real-time socket updates for live orders
  useSocketEvent('order:created', (newOrder) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o._id !== newOrder._id)]);
  });

  useSocketEvent('order:status_changed', (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  });

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ['all', 'received', 'preparing', 'ready', 'completed', 'cancelled'];

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((st) => (
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
          <div className="font-label-caps text-xs text-primary font-semibold">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Loaded
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            LOADING ORDERS BOARD...
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel p-12 text-center text-on-surface-variant text-xs">
            No orders found under "{statusFilter}".
          </div>
        ) : (
          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high text-primary font-label-caps uppercase border-b border-primary/20">
                <tr>
                  <th className="py-4 px-6">Ticket #</th>
                  <th className="py-4 px-6">Guest / Contact</th>
                  <th className="py-4 px-6">Dishes</th>
                  <th className="py-4 px-6">Fulfillment</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-surface-container transition-colors">
                    <td className="py-4 px-6 font-mono text-primary font-bold">
                      {ord.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-on-surface font-semibold">{ord.guestName}</div>
                      <div className="text-on-surface-variant/70 text-[11px]">{ord.guestPhone}</div>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-on-surface-variant">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-4 px-6 capitalize">
                      <span className="inline-block px-2 py-0.5 bg-surface-container-high border border-white/10 text-[10px]">
                        {ord.orderType}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-headline text-sm text-on-surface font-bold">
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-surface border border-primary/30 text-primary font-label-caps text-xs px-2 py-1 uppercase focus:outline-none focus:border-primary"
                      >
                        <option value="received" className="bg-surface text-on-surface">Received</option>
                        <option value="preparing" className="bg-surface text-on-surface">Preparing</option>
                        <option value="ready" className="bg-surface text-on-surface">Ready</option>
                        <option value="completed" className="bg-surface text-on-surface">Completed</option>
                        <option value="cancelled" className="bg-surface text-on-surface">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="font-label-caps text-[11px] text-primary hover:underline uppercase tracking-wider"
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass-panel p-8 relative border-primary animate-fadeIn">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <span className="font-mono text-primary font-bold text-sm tracking-widest block mb-1">
              {selectedOrder.orderNumber}
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-4">
              Ticket Details
            </h2>

            <div className="space-y-4 text-xs text-on-surface-variant border-t border-b border-primary/20 py-4 max-h-72 overflow-y-auto pr-2">
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="text-on-surface font-semibold">{selectedOrder.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone:</span>
                <span className="text-on-surface">{selectedOrder.guestPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-on-surface capitalize">{selectedOrder.orderType}</span>
              </div>
              {selectedOrder.address?.street && (
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="text-on-surface text-right">
                    {selectedOrder.address.street}, {selectedOrder.address.city}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block">
                  Items Breakdown
                </span>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-on-surface">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-headline">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between font-headline text-base text-on-surface font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="font-label-caps text-xs bg-primary text-on-primary px-6 py-2.5 uppercase tracking-wider"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderManagement;
