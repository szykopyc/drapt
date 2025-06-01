export function CollapseArrow({title, children}){
    return (
        <div className="collapse collapse-arrow bg-base-100 border-primary border shadow-md hover:shadow-lg transition shadow">
            <div className="collapse-title text-2xl">{title}</div>
            <div className="collapse-content">
                {children}
            </div>
        </div>
    );
}