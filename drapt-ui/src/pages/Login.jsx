import { Link, useNavigate } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { CardOne } from "../components/baseui/CustomCard";
import { useForm } from "react-hook-form";
import { FormField } from "../components/helperui/FormFieldHelper";
import LargeSubmit from "../components/baseui/LargeSubmitHelper";
import { useState } from "react";
import { FormErrorHelper } from "../components/helperui/FormErrorHelper";
import useUserStore from "../stores/userStore";
import { login, checkAuth } from "../lib/AuthService";

export default function Login() {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onSubmit" });

    const typedUsername = watch("username");
    const typedPassword = watch("password");
    const fieldFilled = typedUsername && typedPassword;

    const [incorrectPasswordError, setIncorrectPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setIncorrectPasswordError("");
        try {
            await login(data.username, data.password);
            // Wait 100ms to ensure the cookie is set
            await new Promise((resolve) => setTimeout(resolve, 100));
            const userData = await checkAuth();
            if (!userData) {
                setIncorrectPasswordError(
                    "Login failed. Please check your credentials."
                );
                return;
            }
            setUser(userData);
            navigate("/");
        } catch (err) {
            setIncorrectPasswordError(
                err?.toString() || "Incorrect username or password."
            );
        } finally {
            setLoading(false);
        }
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
                            label={"Email"}
                            error={errors.username && errors.username.message}
                        >
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                {...register("username", {
                                    required: "Username is required",
                                    onChange: () =>
                                        setIncorrectPasswordError(""),
                                })}
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
                                    onChange: () =>
                                        setIncorrectPasswordError(""),
                                })}
                                autoComplete="current-password"
                            />
                        </FormField>
                        <div className="flex justify-end ">
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
                        <LargeSubmit
                            form="loginForm"
                            disabled={!fieldFilled || loading}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </LargeSubmit>
                    </div>
                </CardOne>
            </div>
        </MainBlock>
    );
}
