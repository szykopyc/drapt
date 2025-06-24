import { Link, useNavigate } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { CardOne } from '../components/baseui/CustomCard';
import { useForm } from 'react-hook-form';
import { FormField } from '../components/helperui/FormFieldHelper';
import LargeSubmit from '../components/baseui/LargeSubmitHelper';
import { useState } from 'react';
import { FormErrorHelper } from '../components/helperui/FormErrorHelper';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const typedUsername = watch("username");
  const typedPassword = watch("password");
  const fieldFilled = typedUsername && typedPassword;

  const [incorrectPasswordError, setIncorrectPasswordError] = useState("");

  const handleInputChange = (e) => {
    setIncorrectPasswordError("");
  }

  const onSubmit = (data) => {
    // Handle login logic here
    // For now a simple redirect will suffice...
    if ((data.username != "abc") || (data.password != "abc")){
      setIncorrectPasswordError("Login failed. Please make sure that your username and password are both correct.");
      return;
    }
    localStorage.setItem('loggedIn', true);
    window.dispatchEvent(new Event('loggedInChange'));
    setIncorrectPasswordError("");
    navigate("/landing");
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
              onChange={e => {
                handleInputChange(e);
                register("username").onChange(e);
              }}
              autoComplete="username"
              autoCapitalize='false'
            />
          </FormField>
          <FormField label={"Password"} error={errors.password && errors.password.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("password", { required: "Password is required" })}
              onChange={e => {
                handleInputChange(e);
                register("password").onChange(e);
              }}
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
        {incorrectPasswordError && (
          <FormErrorHelper textSize='md'>{incorrectPasswordError}</FormErrorHelper>
        )}
        <div className="flex flex-row gap-2 w-full">
          <LargeSubmit form="loginForm" disabled={!fieldFilled}>
            Log In
          </LargeSubmit>
        </div>
        <p>For the purposes of testing, dummy login credentials are "abc" and "abc".</p>
      </CardOne>
    </MainBlock>
  );
}