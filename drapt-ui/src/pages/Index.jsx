import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import CustomButton from "../components/baseui/CustomButton";

export default function Index() {
    const words = [
        "Choose clarity",
        "Choose performance",
        "Choose <span class='text-accent'>Drapt</span>",
    ];
    const [wordIndex, setWordIndex] = useState(0);
    const [showIntro, setShowIntro] = useState(false);
    const [showTypewriter, setShowTypewriter] = useState(false);

    useEffect(() => {
        if (wordIndex < words.length - 1) {
            const interval = setInterval(() => {
                setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
        // Wait a bit after "Drapt" appears, then show intro
        const timeout = setTimeout(() => setShowIntro(true), 600);
        return () => clearTimeout(timeout);
    }, [wordIndex, words.length]);

    // Delay typewriter until after the login button has moved up (animation duration + small buffer)
    useEffect(() => {
        if (showIntro) {
            const timeout = setTimeout(() => setShowTypewriter(true), 800); // adjust as needed for your animation
            return () => clearTimeout(timeout);
        }
    }, [showIntro]);

    return (
        <div className="flex flex-col justify-center items-center min-h-[73vh] md:min-h-[calc(100vh-145px)] flex-grow">
            <div className="flex flex-col items-center w-full">
                {/* Headline */}
                <div className="text-4xl md:text-6xl font-semibold text-center min-h-[72px]">
                    {!showIntro ? (
                        <span
                            className="typewriter inline-block"
                            dangerouslySetInnerHTML={{
                                __html: words[wordIndex],
                            }}
                        ></span>
                    ) : (
                        <span className="text-accent opacity-0 animate-[fadeIn_0.7s_ease-in_forwards] text-7xl">
                            Drapt
                        </span>
                    )}
                </div>
                {showIntro && (
                    <div className="flex flex-col items-center mt-3 opacity-0 animate-[slideUpFade_0.7s_ease-in_forwards]">
                        {showTypewriter ? (
                            <p className="text-xl md:text-2xl font-light text-base-content/70 text-center mb-2">
                                <Typewriter
                                    words={["Quantitative Portfolio Analytics"]}
                                    loop={1}
                                    cursor
                                    cursorStyle="_"
                                    typeSpeed={30}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </p>
                        ) : (
                            <p className="text-xl md:text-2xl mb-2">
                                <br></br>
                            </p>
                        )}
                        <Link
                            to={"/login"}
                            className="btn btn-primary px-10 text-md md:text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            tabIndex={0}
                        >
                            <Link to="/login">Log In</Link>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
