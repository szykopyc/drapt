import { Link } from 'react-router-dom';

export default function Unauthorised() {
  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
    <div className="flex-1 p-6 flex flex-col items-center justify-center bg-base-100 text-base-content text-center">
      <h1 className="text-6xl font-extrabold mb-4 text-primary">401</h1>
      <h2 className="text-3xl font-semibold mb-2">Unauthorised
      </h2>
      <p className="mb-6 max-w-md mx-auto">
        Sorry, you are unauthorised to view this page. Please log in.
      </p>
      <Link to="/login" className="btn btn-primary text-white">
        Login
      </Link>
    </div>
    </div>
  );
}