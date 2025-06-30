import { useState } from "react";

const sizeClassMap = {
    full: "w-full",
    half: "w-1/2",
    third: "w-1/3",
    quarter: "w-1/4",
    auto: "w-auto",
    twothirds: "w-2/3",
};

export function CardOne({
    id = "",
    title,
    badge = null,
    size = "",
    children,
    keyboardShortcut = null,
    ...props
}) {
    const widthClass = sizeClassMap[size] || "w-full";
    return (
        <div
            id={id}
            className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full md:${widthClass} min-w-0`}
            style={{ borderRadius: "var(--border-radius)" }}
            {...props}
        >
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-2xl">{title}</h2>
                    {badge && (
                        <span
                            className="badge badge-s badge-theme"
                            style={{ borderRadius: "var(--border-radius)" }}
                        >
                            {badge}
                        </span>
                    )}
                    {/* 
          {keyboardShortcut && (
            <kbd className="ml-2 px-2 py-1 rounded bg-base-200 text-xs border border-base-300">
              {keyboardShortcut}
            </kbd>
          )}
          */}
                </div>
                {children}
            </div>
        </div>
    );
}

export function CardTwo({ id, title, badge = null, children }) {
    return (
        <div
            id={id}
            className="card bg-primary text-white shadow-md hover:shadow-lg transition-shadow"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-2xl">{title}</h2>
                    {badge && (
                        <span
                            className="badge badge-s badge-theme"
                            style={{ borderRadius: "var(--border-radius)" }}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}

export function CardNoTitle({ id, children, additionalStyle = "", ...props }) {
    return (
        <div
            id={id}
            className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${additionalStyle}`}
            style={{ borderRadius: "var(--border-radius)" }}
            {...props}
        >
            <div className="card-body">{children}</div>
        </div>
    );
}

export function CardNoTitleChildrenCentred({
    id,
    children,
    additionalStyle = "",
    ...props
}) {
    return (
        <div
            id={id}
            className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full ${additionalStyle}`}
            style={{ borderRadius: "var(--border-radius)" }}
            {...props}
        >
            <div className="card-body flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

export function SplitCardBody({ children }) {
    return (
        <div
            className="flex flex-col md:flex-row gap-4 items-start"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            {children}
        </div>
    );
}

export function AnalyseCard({ id, title, children }) {
    return (
        <div
            id={id}
            className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full h-full"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            <div className="card-body flex-col ">
                <h2 className="card-title text-2xl">{title}</h2>
                {children}
            </div>
        </div>
    );
}

export function LoginCard({ id, title, children }) {
    return (
        <div
            id={id}
            className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow w-full h-full"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            <div className="card-body">
                <h2 className="card-title text-2xl">{title}</h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm-max-w-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function CustomCollapseArrow({
    id,
    title,
    children,
    defaultOpen = false,
}) {
    const [open, setOpen] = useState(defaultOpen);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            setOpen((prev) => !prev);
            e.preventDefault();
        }
    };

    return (
        <div
            id={id}
            className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            <div className="card-body">
                <div
                    className="flex items-center justify-between cursor-pointer select-none w-full"
                    onClick={() => setOpen((prev) => !prev)}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    role="button"
                    aria-expanded={open}
                >
                    <h2 className="card-title text-2xl">{title}</h2>
                    <span className="text-base-content">&#x25BC;</span>
                </div>
                <div style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function CustomCollapse({ id, title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            setOpen((prev) => !prev);
            e.preventDefault();
        }
    };

    return (
        <div
            id={id}
            className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            style={{ borderRadius: "var(--border-radius)" }}
        >
            <div className="card-body">
                <div
                    className="flex items-center cursor-pointer select-none w-full"
                    onClick={() => setOpen((prev) => !prev)}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    role="button"
                    aria-expanded={open}
                >
                    <h2 className="card-title text-2xl">{title}</h2>
                </div>
                <div style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ContactProfileCardElement({
    name,
    optionalRole = null,
    introText,
    children,
}) {
    return (
        <div className="sm:w-max md:w-1/2">
            <h2 className="text-2xl font-bold">{name}</h2>
            {optionalRole && (
                <p className="text-base-content/70 mb-2">{optionalRole}</p>
            )}
            <p>{introText}</p>
            <div className="space-y-2 mt-2 text-base-content">{children}</div>
        </div>
    );
}
