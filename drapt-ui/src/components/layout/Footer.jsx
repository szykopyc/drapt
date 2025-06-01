import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="flex flex-row justify-center gap-2 p-4 text-sm text-base-content">
        <p>&copy; 2025 Drapt, Szymon Kopyciński</p>
        <p>•</p>
        <Link to="/about">About</Link>
        <p>•</p>
        <Link to="/contact">Contact</Link>
    </footer>
  );
}