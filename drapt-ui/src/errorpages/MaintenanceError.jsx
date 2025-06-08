import { Link } from 'react-router-dom';

export default function MaintenanceError() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-[59vh] md:min-h-[calc(100vh-145px)] flex-grow px-4">
      <h1 className="text-6xl md:text-9xl font-extrabold text-error">Maintenance</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-center">
        <span className="text-accent">Drapt</span> is currently under planned maintenance.
      </h2>
      <div className="flex flex-col gap-2 text-base md:text-xl text-center max-w-xl w-full">
        <p>
          Drapt is currently under scheduled maintenance. Our team is working hard to get it back as soon as possible.
        </p>
        <p>
          Please come back at a later time. In the meantime, please get in touch with us via WhatsApp if you have any questions.
        </p>
      </div>
    </div>
  );
}