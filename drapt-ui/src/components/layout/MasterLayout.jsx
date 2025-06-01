import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'

export default function MasterLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>

      <main className="flex-grow">
        <Outlet /> {/* 🔥 This is required! */}
      </main>

      <Footer></Footer>
    </div>
  );
}