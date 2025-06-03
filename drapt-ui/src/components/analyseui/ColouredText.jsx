export function ColouredText({status="positive", children}){
    if (status=="positive"){
        return (
            <p className="text-success">{children}</p>
        );
    }
    else if (status=="neutral") {
        return (
            <p className="text-warning">{children}</p>
        );
    }
    else {
        return (
            <p className="text-error">{children}</p>
        );
    }
}