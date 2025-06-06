import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="flex flex-wrap md:flex-row justify-center gap-2 p-4 mb-2 text-sm text-base-content">
        <p>&copy; 2025 Drapt, Szymon Kopyciński</p>
        <p>•</p>
        <Link tabIndex={0} to="/about">About</Link>
        <p>•</p>
        <Link tabIndex={0} to="/contact">Contact</Link>
        <p>•</p>
        <a tabIndex={0} href="https://www.tiingo.com" target="_blank" rel="noopener noreferrer">
          Data provided by Tiingo
        </a>
    </footer>
  );
}