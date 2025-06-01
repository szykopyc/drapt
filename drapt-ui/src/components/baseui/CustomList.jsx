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