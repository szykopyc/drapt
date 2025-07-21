import { FaChartLine } from "react-icons/fa";

export default function InnerEmptyState({
    icon = <FaChartLine className="text-4xl text-base-content/40" />,
    title = "Nothing here yet",
    message = "There's no data to display.",
    children,
    enablePadding = true,
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center ${
                enablePadding ? "py-6" : ""
            } text-center text-base-content/70`}
        >
            <div className="mb-2">{icon}</div>
            <div className="text-lg font-semibold mb-1">{title}</div>
            <div className="mb-3">{message}</div>
            {children}
        </div>
    );
}
