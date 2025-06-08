import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from '@vercel/analytics/react';
import MasterLayout from './components/layout/MasterLayout';
import Landing from './pages/Landing';
import About from './pages/About'
import Contact from './pages/Contact'
import MaintenanceError from './errorpages/MaintenanceError';
import Unauthorised from './errorpages/401Unauthorised';
import Forbidden from './errorpages/403Forbidden';
import NotFound from './errorpages/404NotFound';
import InternalServerError from './errorpages/500InternalServerError';
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword';
import Analyse from './pages/Analyse'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin';
import Profile from './pages/Profile'

function App() {
  return (
    <>
      <Routes>
        <Route element={<MasterLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="analyse" element={<Analyse />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="admin" element={<Admin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ise" element={<InternalServerError />} />
          <Route path="api/*" element={<Unauthorised />} />
          <Route path="maintenance" element={<MaintenanceError />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;