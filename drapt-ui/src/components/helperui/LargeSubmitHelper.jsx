export function LargeSubmit({form,size=1,disabled=null,children}){
    const flexClasses = {
        1: "flex-[1]",
        2: "flex-[2]",
        3: "flex-[3]",
        4: "flex-[4]"
    };
    return (
        <button form={form} type="submit" className={`btn btn-primary mt-2 ${flexClasses[size] || "flex-[1]"} rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content`} disabled={disabled}>
            {children}
        </button>
    );
}