import { FormErrorHelper } from "./FormErrorHelper";

export function FormField({ label, children, error }) {
    return (
        <div>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            {children}
            {error && <FormErrorHelper>{error}</FormErrorHelper>}
        </div>
    );
}
