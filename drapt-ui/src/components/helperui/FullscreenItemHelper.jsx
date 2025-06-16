export default function FullscreenItem({ reference, width = 50, children }) {
    return (
        <div className="modal modal-open">
            <div
                className={`modal-box w-full md:h-auto max-w-full`}
                style={{
                    width: "100%", // mobile default
                    // On md and up, override with the custom width
                    ...(typeof window !== "undefined" && window.innerWidth >= 768
                        ? { width: `${width}%` }
                        : {})
                }}
            >
                <div className="w-full">{children}</div>
                <div className="modal-action">
                    <button className="btn btn-sm" onClick={() => reference(null)}>
                        Close ✕
                    </button>
                </div>
            </div>
        </div>
    );
}