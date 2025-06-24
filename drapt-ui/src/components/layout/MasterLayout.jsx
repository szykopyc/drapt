import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'
import { currentUser } from '../../App';

export default function MasterLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar currentUser={currentUser}></Navbar>

      <main className="flex-grow h-full">
        <Outlet />
      </main>

      <Footer></Footer>
    </div>
  );
}