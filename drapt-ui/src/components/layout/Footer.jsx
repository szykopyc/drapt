import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="flex flex-row justify-center gap-2 p-4 mb-2 text-sm text-base-content">
        <p>&copy; 2025 Drapt, Szymon Kopyciński</p>
        <p>•</p>
        <Link tabIndex={0} to="/about">About</Link>
        <p>•</p>
        <Link tabIndex={0} to="/contact">Contact</Link>
    </footer>
  );
}