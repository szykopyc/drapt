import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("nord");

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
      <option value="draptlight">NEFSIF Light</option>
      <option value="draptdark">NEFSIF Dark</option>
      <option value="cb-light">Colourblind Light</option>
      <option value="cb-dark">Colourblind Dark</option>
      <option value="high-contrast">High Contrast</option>
      <option value="night-coding">Night Coding</option>
    </select>
  );
}