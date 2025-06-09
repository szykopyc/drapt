import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from '@vercel/analytics/react';
import MasterLayout from './components/layout/MasterLayout';
import Index from './pages/Index';
import Landing from './pages/Landing';
import About from './pages/About'
import Contact from './pages/Contact'
import MaintenanceError from './errorpages/MaintenanceError';
import Unauthorised from './errorpages/401Unauthorised';
import Forbidden from './errorpages/403Forbidden';
import NotFound from './errorpages/404NotFound';
import InternalServerError from './errorpages/500InternalServerError';
import ErrorBoundary from './errorpages/ErrorBoundary';
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword';
import Analyse from './pages/Analyse'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin';
import Profile from './pages/Profile'
import ProtectedRoute from './components/authcomponents/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <>
        <Routes>
          <Route element={<MasterLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            {/* Protected routes */}
            <Route path="/landing" element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            } />
            <Route path="analyse" element={
              <ProtectedRoute>
                <Analyse />
              </ProtectedRoute>
            } />
            <Route path="portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="ise" element={<InternalServerError />} />
            <Route path="unauthorised*" element={<Unauthorised />} />
            <Route path="maintenance" element={<MaintenanceError />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <SpeedInsights />
        <Analytics />
      </>
    </ErrorBoundary>
  );
}

export default App;