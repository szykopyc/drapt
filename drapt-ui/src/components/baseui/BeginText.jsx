export function BeginText({title, children}){
    return (
        <div tabIndex={0} className="p-2 mt-2">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                {children}
        </div>
    );
}