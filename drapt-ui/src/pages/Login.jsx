import { Link, useNavigate } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { CardOne } from "../components/baseui/CustomCard";
import { useForm } from "react-hook-form";
import { FormField } from "../components/helperui/FormFieldHelper";
import LargeSubmit from "../components/baseui/LargeSubmitHelper";
import { useState } from "react";
import { FormErrorHelper } from "../components/helperui/FormErrorHelper";
import useUserStore from "../stores/userStore";

export default function Login() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const typedUsername = watch("username");
    const typedPassword = watch("password");
    const fieldFilled = typedUsername && typedPassword;

    const [incorrectPasswordError, setIncorrectPasswordError] = useState("");

    const handleInputChange = (e) => {
        setIncorrectPasswordError("");
    };

    const setUser = useUserStore((state) => state.setUser);

    const onSubmit = (data) => {
        // Handle login logic here
        // For now a simple redirect will suffice...
        if (data.username === "dev" && data.password === "dev") {
            setUser({
                fullname: "Szymon Kopyciński",
                username: "szymonkp",
                email: "szymon.kopycinski@outlook.com",
                role: "developer",
                team: "executive",
            });
        } else if (data.username === "abc" && data.password === "abc") {
            setUser({
                fullname: "Random Analyst",
                username: "randomanalyst",
                email: "random.analyst@outlook.com",
                role: "analyst",
                team: "industrial",
            });
        } else if (data.username === "pm" && data.password === "pm") {
            setUser({
                fullname: "Portfolio Manager",
                username: "portfoliomanager",
                email: "portfolio.manager@outlook.com",
                role: "pm",
                team: "industrial",
            });
        } else {
            setIncorrectPasswordError(
                "Login failed. Please make sure that your username and password are both correct."
            );
            return;
        }

        setIncorrectPasswordError("");
        navigate("/");
    };

    return (
        <MainBlock>
            <div className="flex flex-col justify-center items-center min-h-[70vh] md:min-h-[calc(100vh-173px)] flex-grow">
                <CardOne id={"loginContainer"} title={"Login"}>
                    <form
                        id="loginForm"
                        className="flex flex-col gap-3 w-full"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                    >
                        <FormField
                            label={"Username"}
                            error={errors.username && errors.username.message}
                        >
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("username", {
                                    required: "Username is required",
                                })}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    register("username").onChange(e);
                                }}
                                autoComplete="username"
                                autoCapitalize="false"
                            />
                        </FormField>
                        <FormField
                            label={"Password"}
                            error={errors.password && errors.password.message}
                        >
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    register("password").onChange(e);
                                }}
                                autoComplete="current-password"
                            />
                        </FormField>
                        <div className="flex items-center justify-between">
                            <label className="label cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm mr-2"
                                />
                                <span className="label-text text-base-content text-sm">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-info underline hover:text-primary-focus"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </form>
                    {incorrectPasswordError && (
                        <FormErrorHelper textSize="md">
                            {incorrectPasswordError}
                        </FormErrorHelper>
                    )}
                    <div className="flex flex-row gap-2 w-full">
                        <LargeSubmit form="loginForm" disabled={!fieldFilled}>
                            Log In
                        </LargeSubmit>
                    </div>
                    <p>
                        Dummy login credentials: Developer - "dev" & "dev";
                        Analyst - "abc" & "abc"; PM - "pm" & "pm".
                    </p>
                </CardOne>
            </div>
        </MainBlock>
    );
}
