export function ResetFormButton({ resetFn }) {
    return (
        <button
            type="button"
            onClick={() => resetFn && resetFn()}
            className="btn btn-error text-base-content mt-2 flex-1"
        >
            Reset Form
        </button>
    );
}