export function ResetFormButton({ resetFn, ...props }) {
    return (
        <button
            type="button"
            onClick={() => resetFn && resetFn()}
            className="btn btn-lg md:btn-md w-full rounded-lg shadow-md hover:shadow-lg transition-shadow btn-error text-primary-content"
            {...props}
        >
            Reset Form
        </button>
    );
}