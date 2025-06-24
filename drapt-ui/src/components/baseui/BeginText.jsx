export function BeginText({title, children}){
    return (
        <div className="p-y-2 mt-2 flex flex-col gap-3">
                <h1 className="text-3xl font-bold">{title}</h1>
                {children}
        </div>
    );
}