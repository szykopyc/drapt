export function ResetFormButton({ resetFn, ...props }) {
    return (
        <button
            type="button"
            onClick={() => resetFn && resetFn()}
            className="btn btn-lg md:btn-md rounded-lg shadow-md hover:shadow-lg transition-shadow btn-error text-primary-content mt-2 flex-1"
            {...props}
        >
            Reset Form
        </button>
    );
}