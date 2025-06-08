import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
    <footer className="border-t-1 border-neutral flex flex-col md:flex-row flex-wrap justify-center items-center gap-3 p-4 text-sm text-base-content min-h-[56px]">
      <p>&copy; 2025 Drapt, Szymon Kopyciński</p>
      <span className="hidden md:inline">•</span>
      <Link tabIndex={0} to="/about">About</Link>
      <span className="hidden md:inline">•</span>
      <Link tabIndex={0} to="/contact">Contact</Link>
      <span className="hidden md:inline">•</span>
      <a tabIndex={0} href="https://www.tiingo.com" target="_blank" rel="noopener noreferrer">
        Data provided by Tiingo
      </a>
    </footer>
    </>
  );
}