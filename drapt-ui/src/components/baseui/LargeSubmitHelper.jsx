export default function LargeSubmit({
    form,
    maxHeight = null,
    disabled = null,
    children,
    ...props
}) {
    const style = maxHeight ? { maxHeight } : {};
    return (
        <button
            form={form}
            type="submit"
            className="btn btn-large md:btn-md btn-primary shadow-md hover:shadow-lg transition-shadow rounded-none text-primary-content w-full"
            disabled={disabled}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}
