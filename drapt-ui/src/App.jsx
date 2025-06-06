import { Routes, Route } from 'react-router-dom';
import MasterLayout from './components/layout/MasterLayout';
import Landing from './pages/Landing';
import About from './pages/About'
import Contact from './pages/Contact'
import NoPage from './pages/NoPage'
import Login from './pages/Login'
import Analyse from './pages/Analyse'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin';
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="analyse" element={<Analyse />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="admin" element={<Admin />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;