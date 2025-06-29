export function ResetFormButton({ resetFn, ...props }) {
    return (
        <button
            type="button"
            onClick={() => resetFn && resetFn()}
            className="btn btn-lg md:btn-md w-full shadow-md hover:shadow-lg transition-shadow btn-error text-primary-content"
            style={{ borderRadius: "var(--border-radius)" }}
            {...props}
        >
            Reset Form
        </button>
    );
}
