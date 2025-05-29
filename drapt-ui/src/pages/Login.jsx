import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="p-2 flex flex-col gap-6 mx-auto max-w-5xl">
      <div className="p-2">
        <h1 className="text-3xl font-bold mb-4">Welcome to Drapt</h1>
        <p>Please log in, or <span className='underline hover:text-primary'><Link to="/">create an account</Link></span>.</p>
      </div>
      <div className='card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
        <div className="card-body">
          <h2 className="card-title text-2xl">Login</h2>
            <div className='mt-10 sm:mx-auto sm:w-full sm-max-w-sm'>
              <form className="space-y-6" action="#" method="POST">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-base-content">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      className="input input-bordered w-full mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-base-content">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="input input-bordered w-full mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="label cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-sm mr-2" />
                      <span className="label-text text-sm">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary underline hover:text-primary-focus">Forgot password?</Link>
                  </div>
                  <button type="submit" className="btn btn-primary w-full text-white">Log In</button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}