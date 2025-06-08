import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import MasterLayout from './components/layout/MasterLayout';
import Landing from './pages/Landing';
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/404NotFound'
import Unauthorised from './pages/401Unauthorised';
import InternalServerError from './pages/500InternalServerError';
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
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="admin" element={<Admin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ise" element={<InternalServerError />} />
          <Route path="api/*" element={<Unauthorised />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </>
  );
}

export default App;