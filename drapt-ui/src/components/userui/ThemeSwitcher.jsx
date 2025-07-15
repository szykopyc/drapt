import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState("draptlight");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "draptlight";
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
        <select
            className="select select-bordered"
            value={theme}
            onChange={handleChange}
        >
            <option value="draptlight">NEFSIF Light</option>
            <option value="draptdark">NEFSIF Dark</option>
            <option value="cb-light">Colourblind Light</option>
            <option value="tokyo-storm">Tokyo Storm</option>
            <option value="sunset-water">Sunset on the Water</option>
            <option value="high-contrast">Chocolate Banana</option>
            <option value="hacker-terminal">Scriptkiddie</option>
            <option value="wheatfield-dream">WheatField Dream</option>
            <option value="red-apple-light">Poland</option>
        </select>
    );
}
