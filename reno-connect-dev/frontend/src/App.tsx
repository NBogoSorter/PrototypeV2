import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import BookingPage from './pages/BookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ChatPage from './pages/ChatPage';
import ServicesHowItWorks from './pages/ServicesHowItWorks';
import ServiceManagement from './pages/ServiceManagement';
import AdminDashboard from './pages/AdminDashboard';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  let userRole: string | null = null;
  
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      userRole = user?.role || null;
    }
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
    // If there's an error parsing, try to get role from userRole directly
    userRole = localStorage.getItem('userRole');
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    console.log(`Access Denied. Your role: ${userRole || 'Not set'}. Allowed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/provider/:id" element={<ProviderProfilePage />} />
        <Route path="/booking/:serviceId" element={<BookingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['HOMEOWNER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services/manage" 
          element={
            <ProtectedRoute allowedRoles={['PROVIDER']}>
              <ServiceManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={['HOMEOWNER', 'PROVIDER']}>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/booking/:bookingId"
          element={
            <ProtectedRoute allowedRoles={['HOMEOWNER', 'PROVIDER']}>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/services" element={<ServicesHowItWorks />} />

        {/* Admin Dashboard Route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 