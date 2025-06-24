export function FormErrorHelper({textSize = "xs", children}){
    return (
        <div className={`text-${textSize || "xs"} text-error`}>
            {children}
        </div>
    );
}