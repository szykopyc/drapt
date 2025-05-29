import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between bg-base-200 text-base-content p-6 text-4xl font-bold border-b border-base-300">
        <Link to="/">Drapt</Link>
        <div className='flex flex-row justify-between items-center gap-3 text-sm font-normal'>
          <Link to="/" className='hover:text-primary font-mono underline'>Risk</Link>
          <Link to="/" className='hover:text-primary font-mono underline'>Performance</Link>
          <Link to="/" className='hover:text-primary font-mono underline'>Profile</Link>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Outlet /> {/* 🔥 This is required! */}
      </main>

      <footer className="flex flex-row justify-center gap-2 p-4 text-sm text-base-content">
        <p>&copy; 2025 Drapt, Szymon Kopyciński</p>
        <p>•</p>
        <Link to="/about">About</Link>
        <p>•</p>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}