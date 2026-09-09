import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import ShoppingCart from './pages/ShoppingCart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import BookATable from './pages/BookATable.jsx';
import Gallery from './pages/Gallery.jsx';
import GuestReviews from './pages/GuestReviews.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import MyAccount from './pages/MyAccount.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import ManagementOverview from './pages/admin/ManagementOverview.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import ReservationManagement from './pages/admin/ReservationManagement.jsx';
import MenuManagement from './pages/admin/MenuManagement.jsx';
import GalleryManagement from './pages/admin/GalleryManagement.jsx';
import ReviewModeration from './pages/admin/ReviewModeration.jsx';
import CustomerCRM from './pages/admin/CustomerCRM.jsx';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:itemId" element={<ItemDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/orders/:orderId" element={<OrderTracking />} />
          <Route
            path="/book-a-table"
            element={
              <ProtectedRoute>
                <BookATable />
              </ProtectedRoute>
            }
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<GuestReviews />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <ManagementOverview />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <AdminRoute>
                <ReservationManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminRoute>
                <MenuManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminRoute>
                <GalleryManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <ReviewModeration />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <CustomerCRM />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
