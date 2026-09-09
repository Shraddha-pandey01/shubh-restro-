import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';
import { getSocket } from '../services/socket.js';
import useSocketEvent from '../hooks/useSocketEvent.js';

export const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const steps = [
    { key: 'received', label: 'Order Received', desc: 'Kitchen acknowledged ticket' },
    { key: 'preparing', label: 'Gastronomic Prep', desc: 'Chef assembling dishes' },
    { key: 'ready', label: 'Ready / Dispatched', desc: 'Prepared for table or delivery' },
    { key: 'completed', label: 'Delivered / Completed', desc: 'Enjoy your meal' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.success && res.data) {
          setOrder(res.data);
          // Join socket room for this order
          const socket = getSocket();
          socket.emit('join:order', res.data._id);
        } else {
          const cached = localStorage.getItem(`order_${orderId}`);
          if (cached) {
            setOrder(JSON.parse(cached));
          } else {
            setError('Order not found.');
          }
        }
      } catch {
        const cached = localStorage.getItem(`order_${orderId}`);
        if (cached) {
          setOrder(JSON.parse(cached));
        } else {
          setError('Order tracking is currently offline or order not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Real-time socket status updates
  useSocketEvent('order:status_changed', (updatedOrder) => {
    if (order && (updatedOrder._id === order._id || updatedOrder.orderNumber === order.orderNumber)) {
      setOrder(updatedOrder);
    }
  });

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-48 text-center text-primary font-headline text-lg animate-pulse">
          TRACKING ORDER REAL-TIME...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-48 px-6 text-center max-w-md mx-auto">
          <h2 className="font-headline text-2xl text-error mb-4">{error || 'Order Not Found'}</h2>
          <Link to="/menu" className="font-label-caps text-xs text-primary border border-primary px-6 py-3">
            Return to Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 lg:px-margin-desktop max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Live Ticket Status
          </span>
          <h1 className="font-headline text-3xl md:text-5xl text-on-surface mt-2">
            Order Tracking
          </h1>
          <div className="mt-3 font-mono text-sm text-primary tracking-widest">
            {order.orderNumber}
          </div>
        </div>

        {/* Live Status Progress Bar */}
        <div className="glass-panel p-8 mb-12">
          {isCancelled ? (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-4xl text-error mb-2">cancel</span>
              <h3 className="font-headline text-2xl text-error">This order was cancelled</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Please contact concierge if you believe this is an error.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => {
                const isCompleted = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-12 h-12 flex items-center justify-center font-bold text-sm mb-3 border transition-colors ${
                        isCompleted
                          ? 'bg-primary text-on-primary border-primary'
                          : isCurrent
                          ? 'border-primary text-primary bg-primary/20 ring-2 ring-primary/40 animate-pulse'
                          : 'border-white/20 text-on-surface-variant/40 bg-surface-container'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-lg">check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div
                      className={`font-headline text-sm mb-1 ${
                        isCurrent || isCompleted ? 'text-on-surface font-semibold' : 'text-on-surface-variant/40'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[11px] text-on-surface-variant/60">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 glass-panel p-6">
            <h2 className="font-headline text-lg text-on-surface border-b border-primary/20 pb-3 mb-4">
              Dishes in Ticket
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover border border-primary/20" />
                    )}
                    <div>
                      <div className="font-headline text-sm text-on-surface">{item.name}</div>
                      <div className="text-xs text-on-surface-variant">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-headline text-sm text-primary">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 glass-panel p-6 space-y-4">
            <h2 className="font-headline text-lg text-on-surface border-b border-primary/20 pb-3">
              Fulfillment
            </h2>
            <div className="text-xs text-on-surface-variant space-y-2">
              <div>
                <span className="font-label-caps text-primary uppercase text-[10px]">Recipient:</span>
                <div className="text-on-surface font-medium">{order.guestName}</div>
                <div>{order.guestPhone}</div>
              </div>
              <div className="pt-2">
                <span className="font-label-caps text-primary uppercase text-[10px]">Type:</span>
                <div className="capitalize text-on-surface">{order.orderType}</div>
              </div>
              {order.orderType === 'delivery' && order.address?.street && (
                <div className="pt-2">
                  <span className="font-label-caps text-primary uppercase text-[10px]">Delivery To:</span>
                  <div className="text-on-surface">{order.address.street}</div>
                  <div>{order.address.city} {order.address.postalCode}</div>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between font-headline text-base text-on-surface">
                <span>Total Paid/Due:</span>
                <span className="text-primary font-bold">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
