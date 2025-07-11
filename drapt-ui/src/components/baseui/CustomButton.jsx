import { Link } from "react-router-dom";

const COLOUR_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  success: "btn-success",
  error: "btn-error",
  warning: "btn-warning",
  info: "btn-info",
  ghost: "btn-ghost",
  neutral: "btn-neutral",
};

export default function CustomButton({
  to,
  colour = "primary",
  flexsize = 1,
  children,
  ...props
}) {
  const colourClass = COLOUR_CLASSES[colour] || COLOUR_CLASSES.primary;
  const className = `btn btn-lg md:btn-md ${colourClass} flex-${flexsize || "1"
    } rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content`;

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        tabIndex={0}
        {...props}
        style={{ borderRadius: "var(--border-radius)" }}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={className}
      tabIndex={0}
      {...props}
      style={{ borderRadius: "var(--border-radius)" }}
    >
      {children}
    </button>
  );
}

export function CustomButtonInputStyle({
  to,
  colour = "primary",
  flexsize = 1,
  children,
  ...props
}) {
  const colourClass = COLOUR_CLASSES[colour] || COLOUR_CLASSES.primary;
  const className = `btn btn-lg md:btn-md ${colourClass} flex-${flexsize || "1"
    } shadow-md hover:shadow-lg transition-shadow text-primary-content`;

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        tabIndex={0}
        {...props}
        style={{ borderRadius: "var(--border-radius)" }}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={className}
      tabIndex={0}
      {...props}
      style={{ borderRadius: "var(--border-radius)" }}
    >
      {children}
    </button>
  );
}
