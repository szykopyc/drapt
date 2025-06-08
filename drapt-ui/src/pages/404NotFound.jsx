import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
    <div className="flex-1 p-6 flex flex-col items-center justify-center bg-base-100 text-base-content text-center">
      <h1 className="text-6xl font-extrabold mb-4 text-primary">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 max-w-md mx-auto">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary text-white">
        Go Back Home
      </Link>
    </div>
    </div>
  );
}