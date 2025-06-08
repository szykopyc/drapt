export function FormErrorHelper({textSize = "xs", children}){
    return (
        <div className={`mt-1 text-${textSize || "xs"} text-error`}>
            {children}
        </div>
    );
}