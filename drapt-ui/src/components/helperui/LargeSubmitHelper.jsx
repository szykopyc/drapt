export function LargeSubmit({form,size=1, maxHeight = null,disabled=null,children}){
    const flexClasses = {
        1: "flex-[1]",
        2: "flex-[2]",
        3: "flex-[3]",
        4: "flex-[4]"
    };

    const style = maxHeight ? { maxHeight} : {};

    return (
        <button form={form} type="submit" className={`btn btn-large md:btn-md btn-primary ${flexClasses[size] || "flex-[1]"} rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content`} disabled={disabled} style={style}>
            {children}
        </button>
    );
}