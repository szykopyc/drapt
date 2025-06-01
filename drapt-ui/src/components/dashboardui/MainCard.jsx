export default function MainCard({title, children}){
    return (
        <div className="card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow mt-2">
            <div className="card-body my-1">
                {title && <h2 className="card-title text-2xl">{title}</h2>}
                <div>{children}</div>
            </div>
        </div>
    );
}