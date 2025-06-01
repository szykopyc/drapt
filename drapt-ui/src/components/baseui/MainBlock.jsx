export function MainBlock({children}){
    return (
        <div className="p-2 flex flex-col gap-3 mx-auto max-w-5xl">
            {children}
        </div>
    );
}