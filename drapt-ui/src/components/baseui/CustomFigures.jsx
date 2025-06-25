export function FigureCap({
    srcfile,
    alt,
    cursorPointerEnabled = false,
    children,
    invert = false,
    ...props
}) {
    const textClass = invert ? "text-white-500" : "text-base-content/50";

    return (
        <figure className="flex flex-col items-center my-2" {...props}>
            <img
                src={srcfile}
                alt={alt}
                className={`w-full sm:w-2/3 md:w-1/2 rounded ${
                    cursorPointerEnabled && "cursor-pointer"
                }`}
                loading="lazy"
            />
            <figcaption
                className={`text-xs italic ${textClass} mt-1 text-center`}
            >
                {children}
            </figcaption>
        </figure>
    );
}

export function SmallerFigureCap({
    srcfile,
    alt,
    cursorPointerEnabled = false,
    children,
    invert = false,
    ...props
}) {
    const textClass = invert ? "text-white-500" : "text-base-content/50";

    return (
        <figure
            className="flex flex-col items-center w-full sm:w-3/4 md:w-1/2 lg:w-2/5"
            {...props}
        >
            <img
                src={srcfile}
                alt={alt}
                className={`w-full rounded ${
                    cursorPointerEnabled && "cursor-pointer"
                }`}
                loading="lazy"
            />
            <figcaption
                className={`text-xs italic ${textClass} mt-1 text-center`}
            >
                {children}
            </figcaption>
        </figure>
    );
}

export function FullscreenFigureCap({ srcfile, alt, children, ...props }) {
    return (
        <figure className="flex flex-col items-center my-2" {...props}>
            <img
                src={srcfile}
                alt={alt}
                className="w-full rounded"
                loading="lazy"
            />
            <figcaption
                className={`text-lg italic text-base-content/50 mt-1 text-center`}
            >
                {children}
            </figcaption>
        </figure>
    );
}
