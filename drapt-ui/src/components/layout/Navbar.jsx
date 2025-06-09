import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');

  // Listen for login/logout changes (even across tabs)
  useEffect(() => {
    const handleStorage = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    // Listen for custom event in this tab
    window.addEventListener('loggedInChange', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('loggedInChange', handleStorage);
    };
  }, []);

  return (
    <header className="flex justify-between bg-base-200 text-base-content p-6 text-4xl font-bold border-b border-base-300 items-center relative">
      {!loggedIn && (<Link tabIndex={0} className="text-accent" onClick={() => setMenuOpen(false)} to="/">Drapt</Link>)}
      {loggedIn && (
        <>
        <Link tabIndex={0} className="text-accent" onClick={() => setMenuOpen(false)} to="/landing">Drapt</Link>
        <div className="hidden md:flex flex-row justify-between items-center gap-3 text-sm font-normal">
        <Link tabIndex={0} to="/analyse" className="hover:underline">Analyse</Link>
        <Link tabIndex={0} to="/portfolio" className="hover:underline">Portfolio</Link>
        <Link tabIndex={0} to="/admin" className="hover:underline" onClick={() => setMenuOpen(false)}>Admin</Link>
        <Link tabIndex={0} to="/profile" className="hover:underline">Profile</Link>
      </div>
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col items-end text-right gap-2 absolute top-full left-0 w-full bg-base-200 px-4 pb-4 pt-0 z-20 md:hidden text-base font-normal border-b border-base-300">
          <Link to="/analyse" className="underline" onClick={() => setMenuOpen(false)}>Analyse</Link>
          <Link to="/portfolio" className="underline" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/admin" className="underline" onClick={() => setMenuOpen(false)}>Admin</Link>
          <Link to="/profile" className="underline" onClick={() => setMenuOpen(false)}>Profile</Link>
        </div>
      )}
      </>
      )}
    </header>
  );
}