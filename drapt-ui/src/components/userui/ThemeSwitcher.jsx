import { useEffect } from "react";
import useUserStore from "../../stores/userStore";

export default function ThemeSwitcher() {
    const colourTheme = useUserStore((state) => state.colourTheme);
    const setColourTheme = useUserStore((state) => state.setColourTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", colourTheme);
    }, [colourTheme]);

    const handleChange = (e) => {
        setColourTheme(e.target.value);
    };

    return (
        <select
            className="select select-bordered"
            onChange={handleChange}
            value={colourTheme}
        >
            <option value="draptlight">NEFSIF Light</option>
            <option value="draptdark">NEFSIF Dark</option>
            <option value="cb-light">Colourblind Light</option>
            <option value="cb-dark">Colourblind Dark</option>
            <option value="high-contrast">High Contrast</option>
            <option value="night-coding">Night Coding</option>
        </select>
    );
}
