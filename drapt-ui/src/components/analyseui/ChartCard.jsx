import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

// Global left margin for all charts
// This is done since Recharts has a stupid bug which introduces excess left padding to all charts. Verrrrryyyy dumb...
export let leftMargin = 5;

// global margin modifier
export let margin = { top: 5, right: 5, left: leftMargin, bottom: 5 };

// Utility for rounding numbers to a given decimal place
function roundValue(value, decimals = 0) {
    if (typeof value !== "number") return value;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

function LightTooltip({
    active,
    payload,
    label,
    currency,
    currencyEnabled,
    roundDecimals = 0,
}) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div
            style={{
                background: "#fff",
                color: "#222",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <div className="font-semibold">{label}</div>
            <div>
                {currencyEnabled ? currency : ""}
                {roundValue(payload[0].value, roundDecimals)}
            </div>
        </div>
    );
}

function DarkTooltip({
    active,
    payload,
    label,
    currency,
    currencyEnabled,
    roundDecimals = 0,
}) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div
            style={{
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.32)",
            }}
        >
            <div className="font-semibold">{label}</div>
            <div>
                {currencyEnabled ? currency : ""}
                {roundValue(payload[0].value, roundDecimals)}
            </div>
        </div>
    );
}

function DualTooltip({
    active,
    payload,
    label,
    currency,
    currencyEnabled,
    roundDecimals = 0,
}) {
    if (!active || !payload || payload.length < 2) return null;
    return (
        <div
            style={{
                background: "#fff",
                color: "#222",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <div className="font-semibold">{label}</div>
            <div>
                <span style={{ color: payload[0].color, fontWeight: 500 }}>
                    {payload[0].name}:
                </span>{" "}
                {currencyEnabled ? currency : ""}
                {roundValue(payload[0].value, roundDecimals)}
            </div>
            <div>
                <span style={{ color: payload[1].color, fontWeight: 500 }}>
                    {payload[1].name}:
                </span>{" "}
                {currencyEnabled ? currency : ""}
                {roundValue(payload[1].value, roundDecimals)}
            </div>
        </div>
    );
}

function DualTooltipDark({
    active,
    payload,
    label,
    currency,
    currencyEnabled,
    roundDecimals = 0,
}) {
    if (!active || !payload || payload.length < 2) return null;
    return (
        <div
            style={{
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.32)",
            }}
        >
            <div className="font-semibold">{label}</div>
            <div>
                <span style={{ color: payload[0].color, fontWeight: 500 }}>
                    {payload[0].name}:
                </span>{" "}
                {currencyEnabled ? currency : ""}
                {roundValue(payload[0].value, roundDecimals)}
            </div>
            <div>
                <span style={{ color: payload[1].color, fontWeight: 500 }}>
                    {payload[1].name}:
                </span>{" "}
                {currencyEnabled ? currency : ""}
                {roundValue(payload[1].value, roundDecimals)}
            </div>
        </div>
    );
}

const currencySymbols = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    JPY: "¥",
    CHF: "₣",
    AUD: "A$",
    CAD: "C$",
    CNY: "¥",
    INR: "₹",
};

function getCurrencySymbol(code) {
    return currencySymbols[code] || code || "£";
}

export default function ChartCard({
    title,
    content = null,
    data,
    size = "medium",
    tooltip = null,
    currencyEnabled = true,
    expandButton = false,
    onExpand,
    isExpanded = false,
    roundDecimals = 0, // <--- new prop
    ...props
}) {
    const sizeClasses = {
        small: "w-full md:w-1/3 h-96",
        medium: "w-full md:w-1/2 h-96",
        large: "w-full h-96",
        xlarge: "w-full h-96 md:h-128",
    };

    const [currency, setCurrency] = useState("GBP");
    useEffect(() => {
        const saved = localStorage.getItem("currency") || "GBP";
        setCurrency(saved);
    }, []);

    const theme =
        typeof window !== "undefined"
            ? document.documentElement.getAttribute("data-theme")
            : "light";
    const CustomTooltip = (props) =>
        theme === "draptdark" ||
        theme === "dark" ||
        theme == "tokyo-storm" ||
        theme == "night-coding" ? (
            <DarkTooltip
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        ) : (
            <LightTooltip
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        );

    const [lineColor, setLineColor] = useState("#6366f1");

    useEffect(() => {
        const updateThemeColors = () => {
            const info = getComputedStyle(document.documentElement)
                .getPropertyValue("--p-info")
                .trim();
            setLineColor(info || "#6366f1");
        };

        updateThemeColors();

        const observer = new MutationObserver(updateThemeColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    const xInterval = Math.floor(data.length / 4);
    return (
        <div
            className={`card ${
                isExpanded ? "" : "card-border border-primary"
            } bg-base-100 ${
                isExpanded ? "" : "shadow-md hover:shadow-lg transition-shadow"
            } ${sizeClasses[size]}`}
            style={{
                borderRadius: "var(--border-radius)",
                border: isExpanded ? "none" : undefined,
            }}
            {...props}
        >
            <div
                className="card-body my-1"
                style={{ padding: isExpanded ? "0" : "24px" }}
            >
                <div className="flex items-center justify-between">
                    <h2
                        className={`card-title text-2xl ${
                            !content ? "mb-4" : ""
                        }`}
                    >
                        {title}
                    </h2>
                    {(tooltip || expandButton) && (
                        <div className="flex flex-row gap-1">
                            {tooltip && (
                                <Tippy
                                    content={tooltip}
                                    placement="top"
                                    animation="shift-away"
                                    arrow={true}
                                    interactive={false}
                                    delay={0}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none mb-4">
                                        <FaInfoCircle className="w-4 h-4 text-info" />
                                    </span>
                                </Tippy>
                            )}
                            {expandButton && (
                                <button
                                    type="button"
                                    className="w-5 h-5 flex items-center justify-center"
                                    onClick={onExpand}
                                    aria-label="Expand"
                                >
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {content && <p className="mb-4">{content}</p>}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={margin}>
                        <XAxis
                            dataKey="name"
                            interval={xInterval > 0 ? xInterval - 1 : 0}
                        />
                        <YAxis
                            tickFormatter={(v) =>
                                currencyEnabled
                                    ? `${getCurrencySymbol(
                                          currency
                                      )}${roundValue(v, roundDecimals)}`
                                    : roundValue(v, roundDecimals)
                            }
                            domain={["dataMin-2", "dataMax+2"]}
                            tickCount={6}
                        />
                        <Tooltip content={CustomTooltip} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                            activeDot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DualChartCard({
    title,
    content = null,
    data,
    size = "medium",
    dataKey1 = "value",
    dataKey2 = "value2",
    label1 = "Series 1",
    label2 = "Series 2",
    tooltip = null,
    currencyEnabled = true,
    expandButton = false,
    onExpand,
    isExpanded = false,
    roundDecimals = 0, // <--- new prop
    ...props
}) {
    const sizeClasses = {
        small: "w-full md:w-1/3 h-96",
        medium: "w-full md:w-1/2 h-96",
        large: "w-full h-96",
        xlarge: "w-full h-96 md:h-128",
    };

    const [currency, setCurrency] = useState("GBP");
    useEffect(() => {
        const saved = localStorage.getItem("currency") || "GBP";
        setCurrency(saved);
    }, []);

    const theme =
        typeof window !== "undefined"
            ? document.documentElement.getAttribute("data-theme")
            : "light";
    const CustomTooltip = (props) =>
        theme === "draptdark" || theme === "dark" || theme == "tokyo-storm" ? (
            <DualTooltipDark
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        ) : (
            <DualTooltip
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        );

    const [lineColor, setLineColor] = useState("#6366f1");
    const [lineColor2, setLineColor2] = useState("#f59e42");

    useEffect(() => {
        const updateThemeColors = () => {
            const info = getComputedStyle(document.documentElement)
                .getPropertyValue("--p-info")
                .trim();
            const accent = getComputedStyle(document.documentElement)
                .getPropertyValue("--p-accent")
                .trim();
            setLineColor(info || "#6366f1");
            setLineColor2(accent || "#f59e42");
        };

        updateThemeColors();

        const observer = new MutationObserver(updateThemeColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    const xInterval = Math.floor(data.length / 4);
    return (
        <div
            className={`card ${
                isExpanded ? "" : "card-border border-primary"
            } bg-base-100 ${
                isExpanded ? "" : "shadow-md hover:shadow-lg transition-shadow"
            } ${sizeClasses[size]}`}
            style={{
                borderRadius: "var(--border-radius)",
                border: isExpanded ? "none" : undefined,
            }}
            {...props}
        >
            <div
                className="card-body my-1"
                style={{ padding: isExpanded ? "0" : "24px" }}
            >
                <div className="flex items-center justify-between">
                    <h2
                        className={`card-title text-2xl ${
                            !content ? "mb-4" : ""
                        }`}
                    >
                        {title}
                    </h2>
                    {(tooltip || expandButton) && (
                        <div className="flex flex-row gap-1">
                            {tooltip && (
                                <Tippy
                                    content={tooltip}
                                    placement="top"
                                    animation="shift-away"
                                    arrow={true}
                                    interactive={false}
                                    delay={0}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none mb-4">
                                        <FaInfoCircle className="w-4 h-4 text-info" />
                                    </span>
                                </Tippy>
                            )}
                            {expandButton && (
                                <button
                                    type="button"
                                    className="w-5 h-5 flex items-center justify-center"
                                    onClick={onExpand}
                                    aria-label="Expand"
                                >
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {content && <p className="mb-4">{content}</p>}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={margin}>
                        <XAxis
                            dataKey="name"
                            interval={xInterval > 0 ? xInterval - 1 : 0}
                        />
                        <YAxis
                            tickFormatter={(v) =>
                                currencyEnabled
                                    ? `${getCurrencySymbol(
                                          currency
                                      )}${roundValue(v, roundDecimals)}`
                                    : roundValue(v, roundDecimals)
                            }
                            domain={["dataMin-2", "dataMax+2"]}
                            tickCount={6}
                        />
                        <Tooltip content={CustomTooltip} />
                        <Line
                            type="monotone"
                            dataKey={dataKey1}
                            name={label1}
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                            activeDot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey2}
                            name={label2}
                            stroke={lineColor2}
                            strokeWidth={2}
                            dot={false}
                            activeDot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function ChartNoBorderCard({
    data,
    size = "large",
    tooltip = null,
    currencyEnabled = true,
    expandButton = false,
    roundDecimals = 0, // <--- new prop
}) {
    const sizeClasses = {
        small: "w-full md:w-1/3 h-96",
        medium: "w-full md:w-1/2 h-96",
        large: "w-full h-96",
        xlarge: "w-full h-128",
    };

    const [currency, setCurrency] = useState("GBP");
    useEffect(() => {
        const saved = localStorage.getItem("currency") || "GBP";
        setCurrency(saved);
    }, []);

    const theme =
        typeof window !== "undefined"
            ? document.documentElement.getAttribute("data-theme")
            : "light";
    const CustomTooltip = (props) =>
        theme === "draptdark" ||
        theme === "dark" ||
        theme == "tokyo-storm" ||
        theme == "night-coding" ? (
            <DarkTooltip
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        ) : (
            <LightTooltip
                {...props}
                currency={getCurrencySymbol(currency)}
                currencyEnabled={currencyEnabled}
                roundDecimals={roundDecimals}
            />
        );

    const [lineColor, setLineColor] = useState("#6366f1");

    useEffect(() => {
        const updateThemeColors = () => {
            const info = getComputedStyle(document.documentElement)
                .getPropertyValue("--p-info")
                .trim();
            setLineColor(info || "#6366f1");
        };

        updateThemeColors();

        const observer = new MutationObserver(updateThemeColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    const xInterval = Math.floor(data.length / 4);
    return (
        <div className={`transition-shadow mt-3 ${sizeClasses[size]}`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={margin}>
                    <XAxis
                        dataKey="name"
                        interval={xInterval > 0 ? xInterval - 1 : 0}
                    />
                    <YAxis
                        tickFormatter={(v) =>
                            currencyEnabled
                                ? `${getCurrencySymbol(currency)}${roundValue(
                                      v,
                                      roundDecimals
                                  )}`
                                : roundValue(v, roundDecimals)
                        }
                        domain={["dataMin-2", "dataMax+2"]}
                        tickCount={6}
                    />
                    <Tooltip content={CustomTooltip} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
