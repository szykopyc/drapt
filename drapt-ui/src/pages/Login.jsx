import { Link, useNavigate } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { CardOne } from '../components/baseui/CustomCard';
import { useForm } from 'react-hook-form';
import { FormField } from '../components/helperui/FormFieldHelper';
import { LargeSubmit } from '../components/helperui/LargeSubmitHelper';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const typedUsername = watch("username");
  const typedPassword = watch("password");
  const fieldFilled = typedUsername && typedPassword;

  const onSubmit = (data) => {
    // Handle login logic here
    // For now a simple redirect will suffice...
    navigate("/analyse");
  };

  return (
    <MainBlock>
      <BeginText title={"Welcome to Drapt"}>
        <p>Please log in.</p>
      </BeginText>
      <div className='divider my-0'></div>
      <CardOne id={"loginContainer"} title={"Login"}>
        <form id="loginForm" className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormField label={"Username"} error={errors.username && errors.username.message}>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("username", { required: "Username is required" })}
              autoComplete="username"
            />
          </FormField>
          <FormField label={"Password"} error={errors.password && errors.password.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("password", { required: "Password is required" })}
              autoComplete="current-password"
            />
          </FormField>
          <div className="flex items-center justify-between">
            <label className="label cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm mr-2" />
              <span className="label-text text-base-content text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-info underline hover:text-primary-focus">Forgot password?</Link>
          </div>
        </form>
        <div className="flex flex-row gap-2 w-full">
          <LargeSubmit form="loginForm" size={1} disabled={!fieldFilled}>
            Log In
          </LargeSubmit>
        </div>
      </CardOne>
    </MainBlock>
  );
}