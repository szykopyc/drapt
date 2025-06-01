import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("nord"); // default

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <select className="select select-bordered" value={theme} onChange={handleChange}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="draptlight">NEFS Investment Fund Light</option>
      <option value="draptdark">NEFS Investment Fund Dark</option>
      <option value="business">Business</option>
    </select>
  );
}