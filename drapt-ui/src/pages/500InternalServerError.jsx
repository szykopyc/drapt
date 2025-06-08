import { Link } from 'react-router-dom';

export default function InternalServerError() {
  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-base-100 text-base-content text-center">
        <h1 className="text-6xl font-extrabold mb-4 text-primary">500</h1>
        <h2 className="text-3xl font-semibold mb-2">Internal Server Error</h2>
        <p className="mb-6 max-w-md mx-auto">
          Sorry, something went wrong on our end. Please try again later or contact support if the problem persists.
        </p>
        <Link to="/" className="btn btn-primary text-white">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}