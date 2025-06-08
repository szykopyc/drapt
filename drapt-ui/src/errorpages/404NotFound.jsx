import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-[59vh] md:min-h-[calc(100vh-145px)] flex-grow px-4">
      <h1 className="text-7xl md:text-9xl font-extrabold text-error">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-center">Page Not Found</h2>
      <div className="flex flex-col gap-2 text-base md:text-xl text-center max-w-xl w-full">
        <p>The page you are looking for does not exist or has been moved.</p>
      </div>
      <button className="btn btn-primary px-3 text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <Link to="/">Go Home</Link>
      </button>
    </div>
  );
}