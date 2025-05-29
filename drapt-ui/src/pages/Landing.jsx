import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Landing() {
  const words = [
    "insights.",
    "performance.",
    "<span class='text-primary'>Drapt.</span>"
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (wordIndex === words.length - 1) return;

    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
}, [wordIndex, words.length]);

  return (
    <div className="p-2 flex flex-col gap-6 mx-auto max-w-5xl ">
      <div className="text-3xl sm:text-5xl font-semibold text-center mt-20 h-20">
        <span className="text-base-content">Choose </span>
        <span
          className="typewriter inline-block"
          dangerouslySetInnerHTML={{
            __html: words[wordIndex],
          }}
        ></span>
      </div>
      <div className='text-xl sm:text-2xl font-light text-gray-600 text-center'>
        <p>Welcome aboard.</p>
        <button className="btn btn-primary mt-4 px-10 py-2 text-lg text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link to="/login">Log in to get started</Link>
        </button>
      </div>
    </div>
  );
}