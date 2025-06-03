export function CustomUL({children}){
    return (
        <ul className='list-none pl-2 space-y-1'>
            {children}
        </ul>
    );
}

export function CustomLI({children}){
    return (
        <li className="before:content-['-'] before:mr-2 text-sm">
            {children}
        </li>
    );
}

export function CustomNestedUL({children}){
    return (
        <ul className="list-disc list-inside pl-4 text-sm mt-1 space-y-1">
            {children}
        </ul>
    );
}