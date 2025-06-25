import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();
  
  const words = [
    "Choose clarity",
    "Choose performance",
    "Choose <span class='text-accent'>Drapt</span>"
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      navigate("/landing", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (wordIndex < words.length - 1) {
      const interval = setInterval(() => {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 1100);

      return () => {
        clearInterval(interval);
      };
    }
    // Wait a bit after "Drapt" appears, then show intro
    const timeout = setTimeout(() => setShowIntro(true), 600);
    return () => clearTimeout(timeout);
  }, [wordIndex, words.length]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[74.3vh] md:min-h-[calc(100vh-145px)] flex-grow">
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
            <span className="text-accent opacity-0 animate-[fadeIn_0.7s_ease-in_forwards] text-7xl">Drapt</span>
          )}
        </div>
        {showIntro && (
          <div className="flex flex-col items-center mt-3 opacity-0 animate-[slideUpFade_0.7s_ease-in_forwards]">
            <p className="text-xl md:text-2xl font-light text-base-content/70 text-center mb-2">
              Quantitative Portfolio Analytics
            </p>
            <button className="btn btn-primary px-3 text-md md:text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Link to="/login">Log In</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}