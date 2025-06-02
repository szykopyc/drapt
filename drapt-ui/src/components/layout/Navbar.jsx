import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../userui/ThemeSwitcher';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between bg-base-200 text-base-content p-6 text-4xl font-bold border-b border-base-300 items-center relative">
      <Link tabIndex={0} className="text-accent" to="/">Drapt</Link>
      {/* Desktop links */}
      <div className="hidden md:flex flex-row justify-between items-center gap-3 text-sm font-normal">
        <Link tabIndex={0} to="/analyse" className="hover:font-bold font-mono underline">Analyse</Link>
        <Link tabIndex={0} to="/portfolio" className="hover:font-bold font-mono underline">Portfolio</Link>
        <Link tabIndex={0} to="/profile" className="hover:font-bold font-mono underline">Profile</Link>
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
        <div className="flex flex-col items-end text-right gap-2 absolute top-full left-0 w-full bg-base-200 p-4 z-20 md:hidden text-base font-normal border-b border-base-300">
          <Link to="/analyse" className="hover:font-bold font-mono underline" onClick={() => setMenuOpen(false)}>Analyse</Link>
          <Link to="/portfolio" className="hover:font-bold font-mono underline" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/profile" className="hover:font-bold font-mono underline" onClick={() => setMenuOpen(false)}>Profile</Link>
        </div>
      )}
    </header>
  );
}