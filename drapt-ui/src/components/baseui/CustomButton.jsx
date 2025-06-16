import { Link } from "react-router-dom";

export default function CustomButton({ to, colour = "primary", flexsize = 1, children, ...props }) {
  const className = `btn btn-lg md:btn-md btn-${colour || "primary"} flex-${flexsize || "1"} rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content`;
  if (to) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}