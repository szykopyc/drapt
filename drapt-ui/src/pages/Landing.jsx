import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';

export default function Landing() {
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
    };}
}, [wordIndex, words.length]);

  return (
  <MainBlock>
    <div className="flex flex-col justify-center min-h-[70vh]">
      <div className="text-3xl sm:text-5xl font-semibold text-center mt-20 h-20 ">
        <span className="text-base-content">Choose </span>
        <span
          className="typewriter inline-block"
          dangerouslySetInnerHTML={{
            __html: words[wordIndex],
          }}
        ></span>
      </div>
      <div className='text-xl sm:text-2xl font-light text-base-content/60 text-center'>
        <p>Welcome aboard.</p>
        <button className="btn btn-primary mt-4 px-10 py-2 text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link to="/login">Log in to get started</Link>
        </button>
      </div>
    </div>
  </MainBlock>
);
}