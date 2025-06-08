import { Link } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { LoginCard } from '../components/baseui/CustomCard';

export default function Login() {
  return (
    <MainBlock>
      <BeginText title={"Welcome to Drapt"}>
          <p>Please log in, or <span className='underline hover:text-primary'><Link to="/create">create an account</Link></span>.</p>
      </BeginText>
      <div className='divider my-0'></div>
      <LoginCard id={"loginContainer"} title={"Login"}>
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
                      <span className="label-text text-base-content text-sm">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary underline hover:text-primary-focus">Forgot password?</Link>
                  </div>
                  <button type="submit" className="btn btn-primary w-full text-primary-content">Log In</button>
                </div>
              </form>
      </LoginCard>
    </MainBlock>
  );
}