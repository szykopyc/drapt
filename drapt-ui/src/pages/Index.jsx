import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Index() {
  const words = [
    "clarity.",
    "performance.",
    "<span class='text-accent'>Drapt.</span>"
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (wordIndex < words.length -1 ){
      const interval = setInterval(() => {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 1100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [wordIndex, words.length]);

  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-[59vh] md:min-h-[calc(100vh-145px)] flex-grow">
      <div className="text-4xl md:text-5xl font-semibold text-center">
        <span className="text-base-content">Choose </span>
        <span
          className="typewriter inline-block"
          dangerouslySetInnerHTML={{
            __html: words[wordIndex],
          }}
        ></span>
      </div>
      <div className='text-xl md:text-2xl font-light text-base-content/70 text-center'>
        <p>Welcome aboard.</p>
        <button className="btn btn-primary mt-3 px-3 text-md md:text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link to="/login">Log in to get started</Link>
        </button>
      </div>
    </div>
  );
}